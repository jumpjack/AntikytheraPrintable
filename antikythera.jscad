// Here we define the user editable parameters:
function getParameterDefinitions() {
  return [
    { name: 'numTeeth', caption: 'Number of teeth:', type: 'int', default: 12 },
    { name: 'circularPitch', caption: 'Circular pitch:', type: 'float', default: 5 },
    { name: 'pressureAngle', caption: 'Pressure angle:', type: 'float', default: 20 },
    { name: 'clearance', caption: 'Clearance:', type: 'float', default: 0 },
    { name: 'thickness', caption: 'Thickness:', type: 'float', default: 5 },
    { name: 'centerholeradius', caption: 'Radius of center hole (0 for no hole):', type: 'float', default: 2 },
  ];
}


/////////// Main entry point; here we construct our solid: ////////////
function main(params) {
  var gear = involuteGear(
    params.numTeeth,
    params.circularPitch,
    params.pressureAngle,
    params.clearance,
    params.thickness,
0,0,0
  );
  if(params.centerholeradius > 0)
  {
    var centerhole = CSG.cylinder({start: [0,0,-params.thickness], end: [0,0,params.thickness], radius: params.centerholeradius, resolution: 16});
    gear = gear.subtract(centerhole);
  }

  var gear1 = involuteGear(
    params.numTeeth+3,
    params.circularPitch*2,
    params.pressureAngle,
    params.clearance,
    params.thickness, 0,0,50
  );

  var combine = gear.union(gear1); // Combine gears to show them all together


  return combine ;
}
////////////////////////

/*
  For gear terminology see: 
    http://www.astronomiainumbria.org/advanced_internet_files/meccanica/easyweb.easynet.co.uk/_chrish/geardata.htm
  Algorithm based on:
    http://www.cartertools.com/involute.html

  circularPitch: The distance between adjacent teeth measured at the pitch circle
*/ 

function involuteGear(numTeeth, circularPitch, pressureAngle, clearance, thickness, offsetX, offsetY, offsetZ) {
  // default values:
  if(arguments.length < 3) pressureAngle = 20;
  if(arguments.length < 4) clearance = 0;
  if(arguments.length < 5) thickness = 1;
  if(arguments.length < 6) offsetX = 0;
  if(arguments.length < 7) offsetY = 0;
  if(arguments.length < 8) offsetZ = 0;
  
  var addendum = circularPitch / Math.PI;
  var dedendum = addendum + clearance;
  
  // radiuses of the 4 circles:
  var pitchRadius = numTeeth * circularPitch / (2 * Math.PI);
  var baseRadius = pitchRadius * Math.cos(Math.PI * pressureAngle / 180);
  var outerRadius = pitchRadius + addendum;
  var rootRadius = pitchRadius - dedendum;

  var maxtanlength = Math.sqrt(outerRadius*outerRadius - baseRadius*baseRadius);
  var maxangle = maxtanlength / baseRadius;

  var tl_at_pitchcircle = Math.sqrt(pitchRadius*pitchRadius - baseRadius*baseRadius);
  var angle_at_pitchcircle = tl_at_pitchcircle / baseRadius;
  var diffangle = angle_at_pitchcircle - Math.atan(angle_at_pitchcircle);
  var angularToothWidthAtBase = Math.PI / numTeeth + 2*diffangle;

  // build a single 2d tooth in the 'points' array:
  var resolution = 5;
  var points = [new CSG.Vector2D(0,0)];
  for(var i = 0; i <= resolution; i++)   {
    // first side of the tooth:
    var angle = maxangle * Math.pow(i/resolution, 2/3);
    var tanlength = angle * baseRadius;
    var radvector = CSG.Vector2D.fromAngle(angle);    
    var tanvector = radvector.normal();
    var p = radvector.times(baseRadius).plus(tanvector.times(tanlength));
    points[i+1] = p;

    // opposite side of the tooth:
    radvector = CSG.Vector2D.fromAngle(angularToothWidthAtBase - angle);    
    tanvector = radvector.normal().negated();
    p = radvector.times(baseRadius).plus(tanvector.times(tanlength));
    points[2 * resolution + 2 - i] = p;
  }

  // create the polygon representing one tooth and extrude into 3D:
  var tooth3d = new CSG.Polygon2D(points).extrude({offset: [0, 0, thickness]});

  var allteeth = new CSG();
  for(var i = 0; i < numTeeth; i++)  {
    var angle = i*360/numTeeth;
    var rotatedtooth = tooth3d.rotateZ(angle);
    allteeth = allteeth.unionForNonIntersecting(rotatedtooth); //Add tooth to the others
  }

  // build the root circle:  
  points = [];
  var toothAngle = 2 * Math.PI / numTeeth;
  var toothCenterAngle = 0.5 * angularToothWidthAtBase; 
  for(var i = 0; i < numTeeth; i++)  {
    var angle = toothCenterAngle + i * toothAngle;
    var p = CSG.Vector2D.fromAngle(angle).times(rootRadius);
    points.push(p);
  }

  // create the polygon representing root circle and extrude into 3D:
  var rootcircle = new CSG.Polygon2D(points).extrude({offset: [0, 0, thickness]});

  var result = rootcircle.union(allteeth); // Merge teeth with circle

  // Position as needed:
  result = result.translate([offsetX, offsetY, -thickness/2 + offsetZ]);

  return result;
}
