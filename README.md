# Gate Opener server and mobile client

## How to use

1. With node.js installed, go to the root directory of this repository and run:

       npm install

2. Connect your Arduino

3. Check the file descriptor of your Arduino and change it in `app.js`

4. Run the following command to connect to the Arduino and start the Web
   server:

       node app.js

5. When your mobile phone is in the same network as the computer, point its
   browser to `http://{IP address of your computer}:1337`
