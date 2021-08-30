# immerStreaming
immerStreaming is a novel approach for measuring, streaming and sharing remote audiences' heart rates during live streaming events. 
# Client
DUInterrupt-1-master contains an Apple Watch app that measure users' heartrates and a companion iOS app that receives the data from Apple Watch and send it to the server
## Client-Dependencies
Charts, FlexTabBar, lottie-ios, DropDown, SwiftyOnboard, AORangeSlider and Socket.IO-Client-Swift 15.2.0 are needed. You can just cd to the folder contains "Podfile". And type "pod install" in Terminal
# Server
ser.js is the server file, homePage.html is the webpage file that contains live streaming video and heatrate visualizations.
## Server-Dependencies
This node.js requires also a redis client, run either on the same server or seperately. After installing both of these you can either install from the package.json using a command such as "npm ci" or to get the latest versions of the packages run "npm install express socket.io mathjs redis json2csv express-basic-auth".
# Running it
1. Install the apps in your Apple Watch and iPhone.
2. cd into the directory and then run node ser.js
3. Then you can go to "https://HOSTNAME.com/home" to see the vialization.


