module.exports = function(RED) {
    'use strict';
    var mustache = require('mustache');
    var sql = require('mssql');

    function connection(config) {
        RED.nodes.createNode(this, config);

        var node = this;

        this.config = {
            user: node.credentials.username,
            password: node.credentials.password,
            domain: node.credentials.domain,
            server: config.server,
            port: config.port,
            database: config.database,
            connectionTimeout: config.connectionTimeout,
            requestTimeout: config.requestTimeout,
            options: {
                encrypt: config.encyption,
                useUTC: config.useUTC
            }
        };
        //this.log("output debug message, the value of the user is " + this.connection.config.user); //JB
        // this.log("output debug message, the value of the password is " + this.connection.config.password); //JB
        // this.log("output debug message, the value of the domain is " + this.connection.config.domain); //JB
        // this.log("output debug message, the value of the server is " + this.connection.config.server); //JB
        // this.log("output debug message, the value of the port is " + this.connection.config.port); //JB
        // this.log("output debug message, the value of the database is " + this.connection.config.database); //JB
        // this.log("output debug message, the value of the connectionTimeout is " + this.connection.config.connectionTimeout); //JB
        // this.log("output debug message, the value of the requestTimout is " + this.connection.config.requestTimeout); //JB
        // this.log("output debug message, the value of the encrypt is " + this.connection.config.options.encrypt); //JB
        // this.log("output debug message, the value of the useUTC is " + this.connection.config.options.useUTC); //JB



        this.connection = sql;
        /*
			node.on('close',function(){
   			node.pool.close(function(){});
   		})
			*/
    }

    RED.nodes.registerType('MSSQL-UCGv2-CN', connection, {
        credentials: {
            username: { type: 'text' },
            password: { type: 'password' },
            domain: { type: 'text' }
        }
    });

    function mssqlv2(config) {
        RED.nodes.createNode(this, config);
        var mssqlCN = RED.nodes.getNode(config.mssqlCN);
        this.query = config.query;
        this.connection = mssqlCN.connection;
        this.config = mssqlCN.config;
        this.outField = config.outField;

        var node = this;
        var b = node.outField.split('.');
        var i = 0;
        var r = null;
        var m = null;
        var rec = function(obj) {
            i += 1;
            if ((i < b.length) && (typeof obj[b[i - 1]] === 'object')) {
                rec(obj[b[i - 1]]); // not there yet - carry on digging
            } else {
                if (i === b.length) { // we've finished so assign the value
                    obj[b[i - 1]] = r;
                    node.send(m);
                    node.status({});
                } else {
                    obj[b[i - 1]] = {}; // needs to be a new object so create it
                    rec(obj[b[i - 1]]); // and carry on digging
                }
            }
        };

        node.on('input', function(msg) {

            if (msg.user != '') { node.config.user = msg.user; }
            if (msg.password != '') { node.config.password = msg.password; }
            if (msg.domain != '') { node.config.domain = msg.domain; }
            if (msg.server != '') { node.config.server = msg.server; }
            if (msg.port != '') { node.config.port = msg.port; }
            if (msg.database != '') { node.config.database = msg.database; }
            if (msg.connectionTimeout != '') { node.config.connectionTimeout = msg.connectionTimeout; }
            if (msg.requestTimeout != '') { node.config.requestTimeout = msg.requestTimeout; }
            this.log("output debug message2, the value of the node config in the connection is " + node.config); //JB
            this.log("output debug message2, the value of the user is " + node.config.user); //JB
            this.log("output debug message2, the value of the password is " + node.config.password); //JB
            this.log("output debug message2, the value of the domain is " + node.config.domain); //JB
            this.log("output debug message2, the value of the server is " + node.config.server); //JB
            this.log("output debug message2, the value of the port is " + node.config.port); //JB
            this.log("output debug message2, the value of the database is " + node.config.database); //JB
            this.log("output debug message2, the value of the connectionTimeout is " + node.config.connectionTimeout); //JB
            this.log("output debug message2, the value of the requestTimout is " + node.config.requestTimeout); //JB
            this.log("output debug message2, the value of the encrypt is " + node.config.encrypt); //JB
            this.log("output debug message2, the value of the useUTC is " + node.config.useUTC); //JB
            node.connection.connect(node.config).then(function() {

                node.status({ fill: 'blue', shape: 'dot', text: 'requesting' });

                var query = mustache.render(node.query, msg);

                if (!query || (query === '')) {
                    query = msg.payload;
                }

                var request = new node.connection.Request();

                request.query(query).then(function(rows) {
                    i = 0;
                    r = rows;
                    m = msg;
                    rec(msg);
                }).catch(function(err) {
                    node.error(err, msg);
                    node.status({ fill: 'red', shape: 'ring', text: 'Error' });
                    return;
                });


            }).catch(function(err) {
                node.error(err, msg);
                node.status({ fill: 'red', shape: 'ring', text: 'Error' });
                return;
            });
        });

    }
    RED.nodes.registerType('MSSQL-UCGv2', mssqlv2);
};