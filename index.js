const os = require('os')
const osutils = require('os-utils')
const events = require('events')
let eventEmitter = new events.EventEmitter()
let ret = {
	config: {
		timer: 1
	},
	get: function(){
		return {
			arch: os.arch(),
			cpus: os.cpus(),
			loadavg: os.loadavg(),
			networkInterfaces: os.networkInterfaces(),
			platform: os.platform(),
			release: os.release(),
			type: os.type(),
			uptime: os.uptime(),
			userInfo: os.userInfo(),
			memory: {
				free: Math.round(os.freemem()/1000000)+" MB",
				total: Math.round(os.totalmem()/1000000)+" MB",
				calc_free: Math.round(os.freemem()*100/os.totalmem())+"%",
				calc_used: 100-Math.round(os.freemem()*100/os.totalmem())+"%",
			}
		}
	},
	save: {
		cpu: false,
		ram: false,
		load: false,
	},
	cpu: function(c){
		if(ret.save.cpu!==false) c(ret.save.cpu)
		eventEmitter.on("cpu",c)
	},
	ram: function(c){
		if(ret.save.ram!==false) c(ret.save.ram)
		eventEmitter.on("ram",c)
	},
	load: function(c){
		if(ret.save.load!==false) c(ret.save.load)
		eventEmitter.on("load",c)
	},
	change: function(c){
		if(ret.save.cpu!==false||ret.save.ram!==false||ret.save.load!==false) c(ret.save)
		eventEmitter.on("change",c)
	},
	tick: function(c){
		eventEmitter.on("tick",c)
	},
	update: function(c){
		let ram = false
		let test_ram = {
			total: Math.round(os.totalmem()/1000000)+" MB",
			free: Math.round(os.freemem()/1000000)+" MB",
			used: Math.round((os.totalmem()-os.freemem())/1000000)+" MB",
			calc_free: Math.round(os.freemem()*100/os.totalmem())+"%",
			calc_used: 100-Math.round(os.freemem()*100/os.totalmem())+"%"
		}
		if(JSON.stringify(test_ram)!=JSON.stringify(ret.save.ram)){
			ret.save.ram = test_ram
			ram = test_ram
		}
		let load = false
		let test_load = os.loadavg()
		for( var i=0; i < test_load.length; i++ ){
			test_load[i] = Math.round(test_load[i]*100)/100
		}
		if(JSON.stringify(test_load)!=JSON.stringify(ret.save.load)){
			ret.save.load = test_load
			load = test_load
		}
		osutils.cpuUsage(function(get_cpu){
			let cpu = false
			let test_cpu = Math.round(get_cpu*100)
			if(test_cpu!=ret.save.cpu){
				ret.save.cpu = test_cpu
				cpu = test_cpu
			}
			c(cpu,ram,load)
		})
	},
	timer: false,
	init: function(conf){
		if(typeof(conf)!=undefined){
			for( var k in conf ){
				if(ret.config.hasOwnProperty(k)) ret.config[k] = conf[k]
			}
		}
		ret.timer = setInterval(function(){
			ret.update(function(cpu,ram,load){
				if(cpu!==false) eventEmitter.emit("cpu",cpu)
				if(ram!==false) eventEmitter.emit("ram",ram)
				if(load!==false) eventEmitter.emit("load",load)
				if(cpu!==false||ram!==false||load!==false) eventEmitter.emit("change",ret.save)
				eventEmitter.emit("tick",ret.save)
			})
		},ret.config.timer*1000)
	}
}
module.exports = ret
