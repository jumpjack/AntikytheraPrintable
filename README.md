# AntikytheraPrintable
3d-printable version of Antikythera machine made possible by OpenJsCad


This [amazing site](https://satadorus.eu/x_ite/yaas_2_1/yaas_2_1.html) shows an interactive 3d model of Antikythera machine. You can explore it in any part in detail, see the movement,show/hide parts.
But once you are happy with it and you want to print it? ;-)

This repo comes in help.

Thanks to OpenJsCad capabilities, I am  trying to build a complete Antikythera mechanism made of STL gears which you can print to build your own machine.

I started from the [demo source code here](https://joostn.github.io/OpenJsCad/) ("Involute Gears"), which allows just creating one single spur gear, and I modded it to allow positioning gear in space and showing all gears at a time rather than ony by one.

Positioning each gear should be "easy" by taking into account that:
- distance between two gears is given by the sum of  their radii
- gear radius is determined ny its module and its teeth number
- this reference picture shows gear trains of Antikythera machine

![image](https://github.com/jumpjack/AntikytheraPrintable/assets/1620953/dacf78d0-1afd-48a6-8955-5a9aa50cc64c)

Note that apaprently B(64) has been written twice just for clarity, but actually it's just one gear attached to two gear trains.

The most difficult part will be to implement the weird coupling of K1+K2 gears:

![image](https://github.com/jumpjack/AntikytheraPrintable/assets/1620953/bcc8736d-e01f-42e7-9214-6939f6de892e)

They are not coaxial or tangent, they interact through a pin, which makes K2 rotate at variable speed while K1 rotates at constant speed.



