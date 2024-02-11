# fitbit-metronome
A metronome app for Fitbit OS (Versa 3 and Sense).

You can get the finished product from [here](https://gallery.fitbit.com/details/d368bb56-a3b1-4341-8738-4c247a889549), and documentation [here](https://gondwanasoftware.au/fitbit/products/metronome).

### Structure

The app has several different display modes (session timer paused, session timer playing, metronome selection, etc). Each of these is handled in JavaScript as a separate Object (actually, a closure). A crude finite state machine approach is used switch between them.


### Missing Stuff

I originally intended to make the state-machine structure much more rigorous (including possible use of Fitbit's dynamic document API); however, during the development of this app, my watches died and took my motivation with them.

The original version of this app was AOD-enabled. The AOD permission request has been removed from this repo's `package.json` since most devs haven't been authorised to publish AOD-enabled products. If you have been so authorised, or if you just wish to run the app on the Fitbit simulator, you can reinstate the permission request.

The original version of this app attempted to target Versa 4 and Sense 2 (in addition to Versa 3 and Sense 1). The former targets have been removed, but I haven't checked whether this repo builds and runs correctly in its current configuration.

`vig.png` normally fades the edges of the background to black, but has been replaced by a transparent image in this repository because it is also used in non-free products.

### Acknowledgements

Shadow text is based on [fitbit-3D-text by BarbWire](https://github.com/BarbWire-1/fitbit-3D-text).

Advice on vibration patterns was provided by [Guy](https://gallery.fitbit.com/developer/f7cd1edb-604b-45f9-9487-0ccaf6b0481a) and [BarbWire](https://gallery.fitbit.com/search?terms=barbwire).

Guy's [SimpleVibrate app](https://gallery.fitbit.com/details/02ce3371-378f-46d5-9847-ae872088abb5) was used to test vibration patterns.

The [metronome icon](https://www.flaticon.com/free-icon/metronome_5144610) is based on [Metronome icons created by surang - Flaticon](https://www.flaticon.com/free-icons/metronome).