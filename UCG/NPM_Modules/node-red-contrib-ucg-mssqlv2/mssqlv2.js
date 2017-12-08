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
            connectTimeout: config.connectTimeout,
            requestTimeout: config.requestTimeout,
            options: {
                encrypt: config.encyption,
                useUTC: config.useUTC
            },
            pool: {
                max: config.pool,
                min: 0,
                idleTimeoutMillis: config.connectTimeout
            },
        };
        //this.log("output debug message, the value of the user is " + node.credentails.username); //JB
        // this.log("output debug message, the value of the password is " + this.connection.config.password); //JB
        // this.log("output debug message, the value of the domain is " + this.connection.config.domain); //JB
        // this.log("output debug message, the value of the server is " + this.connection.config.server); //JB
        // this.log("output debug message, the value of the port is " + this.connection.config.port); //JB
        // this.log("output debug message, the value of the database is " + this.connection.config.database); //JB
        // this.log("output debug message, the value of the connectionTimeout is " + this.connection.config.connectionTimeout); //JB
        //this.log("output debug message, the value of the requestTimout is " + config.requestTimeout); //JB
        // this.log("output debug message, the value of the encrypt is " + this.connection.config.options.encrypt); //JB
        // this.log("output debug message, the value of the useUTC is " + this.connection.config.options.useUTC); //JB 



        this.connection = sql;
        /*
                node.on('close', function() {
                    node.pool.close(function() {});
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

            //this.log("output debug nodeconfg, the value of the node user is " + node.config.user); //JB
            //this.log("output debug nodeconfig, the value of the node password is " + node.config.password); //JB
            //this.log("output debug nodeconfig, the value of the node domain is " + node.config.domain); //JB
            //this.log("output debug nodeconfig, the value of the node server is " + node.config.server); //JB
            //this.log("output debug nodeconfig, the value of the node port is " + node.config.port); //JB
            //this.log("output debug nodeconfig, the value of the node database is " + node.config.database); //JB
            //this.log("output debug nodeconfig, the value of the node connectionTimeout is " + node.config.connectTimeout); //JB
            //this.log("output debug nodeconfig, the value of the node requestTimout is " + node.config.requestTimeout); //JB
            //this.log("output debug nodeconfg, the value of the msg user is " + msg.user); //JB
            //this.log("output debug nodeconfig, the value of the msg password is " + msg.password); //JB
            //this.log("output debug nodeconfig, the value of the msg domain is " + msg.domain); //JB
            //this.log("output debug nodeconfig, the value of the msg server is " + msg.server); //JB
            //this.log("output debug nodeconfig, the value of the msg port is " + msg.port); //JB
            //this.log("output debug nodeconfig, the value of the msg database is " + msg.database); //JB
            //this.log("output debug nodeconfig, the value of the msg connectionTimeout is " + msg.connectionTimeout); //JB
            //this.log("output debug nodeconfig, the value of the msg requestTimeout is " + msg.requestTimeout); //JB
            if (typeof msg.user !== "undefined") { node.config.user = msg.user; }
            if (typeof msg.password !== "undefined") { node.config.password = msg.password; }
            if (typeof msg.domain !== "undefined") { node.config.domain = msg.domain; }
            if (typeof msg.server !== "undefined") { node.config.server = msg.server; }
            if (typeof msg.port !== "undefined") { node.config.port = msg.port; }
            if (typeof msg.database !== "undefined") { node.config.database = msg.database; }
            if (typeof msg.connectionTimeout !== "undefined") { node.config.connectTimeout = msg.connectionTimeout; }
            if (typeof msg.requestTimeout !== "undefined") { node.config.requestTimeout = msg.requestTimeout; }
            if (typeof msg.poolsize !== "undefined") { node.config.pool = msg.requestTimeout; }
            //this.log("output debug message2, the value of the node config in the connection is " + node.config); //JB
            //this.log("output debug message2, the value of the user is " + node.config.user); //JB
            // this.log("output debug message2, the value of the password is " + node.config.password); //JB
            // this.log("output debug message2, the value of the domain is " + node.config.domain); //JB
            // this.log("output debug message2, the value of the server is " + node.config.server); //JB
            // this.log("output debug message2, the value of the port is " + node.config.port); //JB
            // this.log("output debug message2, the value of the database is " + node.config.database); //JB
            // this.log("output debug message2, the value of the connectionTimeout is " + node.config.connectTimeout); //JB
            // this.log("output debug message2, the value of the requestTimout is " + node.config.requestTimeout); //JB
            // this.log("output debug message2, the value of the encrypt is " + node.config.encrypt); //JB
            // this.log("output debug message2, the value of the useUTC is " + node.config.useUTC); //JB
            node.connection.connect(node.config).then(function(connection) {

                node.status({ fill: 'blue', shape: 'dot', text: 'requesting' });

                var query = mustache.render(node.query, msg);

                if (!query || (query === '')) {
                    query = msg.payload;
                }

                var request = new node.connection.Request(connection);

                request.query(query).then(function(rows) {
                    i = 0;
                    r = rows;
                    m = msg;
                    rec(msg);
                    connection.close();
                }).catch(function(err) {
                    node.error(err, msg);
                    node.status({ fill: 'red', shape: 'ring', text: 'Error' });
                    connection.close();
                    return;
                });


            }).catch(function(err) {
                node.error(err, msg);
                node.status({ fill: 'red', shape: 'ring', text: 'Error' });
                connection.close();
                return;
            });
        });

    }
    RED.nodes.registerType('MSSQL-UCGv2', mssqlv2);
};