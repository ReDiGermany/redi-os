# System Load
###### the simple way to stay informed with your system
Install via NPM:
```npm
npm i redi-os --save
```
Only tested on Raspberry Pi Zero W on NodeJS Version `v10.14.2`
---
## API
###### Configuration
name|type|default|description
--- | --- | --- | ---
timer|int|1|check interval in seconds
###### Events
name|description|response
--- | --- | ---
init|initials the timer|
cpu|gets your current cpu load|%
ram|gets your current ram| { total: 'XXX MB', free: 'XXX MB', used: 'XXX MB', calc_free: 'XXX%', calc_used: 'XXX%' }
load|gets your current disk load|[X,Y,Z]
tick|response on every timer tick|{ cpu: XXX, ram: { total: 'XXX MB', free: 'XXX MB', used: 'XXX MB', calc_free: 'XXX%', calc_used: 'XXX%' }, load: [X,Y,Z] }
change|response if cpu,ram or load has changed|{ cpu: XXX, ram: { total: 'XXX MB', free: 'XXX MB', used: 'XXX MB', calc_free: 'XXX%', calc_used: 'XXX%' }, load: [X,Y,Z] }
---
Full example as in [`example.js`](https://github.com/ReDiGermany/redi-os/blob/master/example.js)
```javascript
const os = require('redi-os')
os.cpu( data => { console.log("cpu",data) })
os.ram( data => { console.log("ram",data) })
os.load( data => { console.log("load",data) })
os.tick( data => { console.log("tick",data) })
os.change( data => { console.log("change",data) })
os.init({timer:1})

```
