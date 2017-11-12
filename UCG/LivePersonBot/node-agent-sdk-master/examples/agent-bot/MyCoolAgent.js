'use strict';

/*
 * This demo try to use most of the API calls of the mssaging agent api. It:
 * 
 * 1) Registers the agent as online
 * 2) Accepts any routing task (== ring)
 * 3) Publishes to the conversation the consumer info when it gets new conversation
 * 4) Gets the content of the conversation
 * 5) Emit 'MyCoolAgent.ContentEvnet' to let the developer handle contentEvent responses
 * 6) Mark as "read" the handled messages
 * 
 */

const Agent = require('./../../lib/AgentSDK');
var request = require('request');
var watsonAnswer = [];
var saveAgent;
class MyCoolAgent extends Agent {
    constructor(conf) {
        super(conf);
        this.conf = conf;
        this.init();
        this.CONTENT_NOTIFICATION = 'MyCoolAgent.ContentEvnet';
    }

    init() {
        let openConvs = {};

        this.on('connected', msg => {
            console.log('connected...', this.conf.id || '');
            this.setAgentState({availability: "ONLINE"});
            this.subscribeExConversations({
                'agentIds': [this.agentId],
                'convState': ['OPEN']
            }, (e, resp) => console.log('subscribed successfully', this.conf.id || ''));
            this.subscribeRoutingTasks({});
        });

        // Accept any routingTask (==ring)
        this.on('routing.RoutingTaskNotification', body => {
            body.changes.forEach(c => {
                if (c.type === "UPSERT") {
                    c.result.ringsDetails.forEach(r => {
                        if (r.ringState === 'WAITING') {
                            this.updateRingState({
                                "ringId": r.ringId,
                                "ringState": "ACCEPTED"
                            }, (e, resp) =>{
                                console.log(resp);

                            } );
                        }
                    });
                }
            });
        });

        // Notification on changes in the open consversation list
        this.on('cqm.ExConversationChangeNotification', notificationBody => {
            notificationBody.changes.forEach(change => {
                var participantsList = change.result.conversationDetails.participants; //get participants list
                var getParticipantIdByRole = function(list, role){ //helper func
                    var arr = list.filter(p => p.role === role);
                    return arr && arr.length > 0 && arr[0].id;
                };
                if (change.type === 'UPSERT' && !openConvs[change.result.convId] && getParticipantIdByRole(participantsList, 'ASSIGNED_AGENT') == this.agentId) {
                    // new conversation for me
                    openConvs[change.result.convId] = {
                        joined: new Date().getTime()
                    };
                    // demonstraiton of using the consumer profile calls
                    const consumerId = change.result.conversationDetails.participants.filter(p => p.role === "CONSUMER")[0].id;
                    this.getUserProfile(consumerId, (e, profileResp) => {
                        this.publishEvent({
                            dialogId: change.result.convId,
                            event: {
                                type: 'ContentEvent',
                                contentType: 'text/plain',
                         //       message: `Just joined to conversation with ${JSON.stringify(profileResp)}`
                                  message: `Just joined to conversation with IBM Watson`
                            }
                        });
                    
                        //Add call to NodeRed to start convo
                        var myUrl = `http://${process.env.ucg_domain}/liveperson?user_id=${change.result.convId}&wcs_username=${process.env.wcs_username}&wcs_password=${process.env.wcs_password}&workspace_id=${process.env.workspace_id}&text=\'Hi\'&fname=dennis`
                        console.log('Web Request ', myUrl)                    
                        saveAgent = this;
                        request.post(myUrl, function (error, response, body) {
                       //   console.log('error:', error); // Print the error if one occurred
                       //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                       //  console.log('body:', body); // Return from WCS
                         watsonAnswer = JSON.parse(body);
                         console.log('watsonAnswer:', JSON.stringify(watsonAnswer));
                         var i = 0;
                         if (typeof watsonAnswer.text !== "undefined") {
             
                           for (i = 0; i < watsonAnswer.text.length; i++) {

                             saveAgent.publishEvent({
                                dialogId: change.result.convId,
                                event: {
                                  type: 'ContentEvent',
                                  contentType: 'text/plain',
                                  message : watsonAnswer.text[i]
                                }
                             });
            
                           }


                         } 
            
                         if (typeof watsonAnswer.content !== "undefined") {
                            for (i = 0; i < watsonAnswer.content.elements[0].text.length; i++) {

                             if ((i+1) == (watsonAnswer.content.elements[0].text.length)) {
                                var saveLast = watsonAnswer.content.elements[0].text[i]
                                console.log('saveLast:', saveLast);
                                watsonAnswer.content.elements[0].text = saveLast
                                i = 1000
                                console.log('mycoolagent content before at last :', JSON.stringify(watsonAnswer.content)); 
                                saveAgent.publishEvent({
                                  dialogId: change.result.convId,
                                  event: {
                                     type: 'RichContentEvent',
                                     content: watsonAnswer.content
                                  }
                                }, function(err) {
                                     if (err) {console.log('error', err)}
                                  }
                                );

                              }
                             else {
                    
                               console.log('mycoolagent content at each turn :', watsonAnswer.content.elements[0].text[i]); 
                               saveAgent.publishEvent({
                                  dialogId: change.result.convId,
                                  event: {
                                    type: 'ContentEvent',
                                    contentType: 'text/plain',
                                    message : watsonAnswer.content.elements[0].text[i]
                                  }
                               });


                             }    
                            }
                           }
                        })
                      

                        // End of code add
                    }); 
                    this.subscribeMessagingEvents({dialogId: change.result.convId});
                } else if (change.type === 'DELETE') {
                    // conversation was closed or transferred
                    delete openConvs[change.result.convId];
                }
            });
        });

        // Echo every unread consumer message and mark it as read
        this.on('ms.MessagingEventNotification', body => {
            const respond = {};
            body.changes.forEach(c => {
                // In the current version MessagingEventNotification are recived also without subscription
                // Will be fixed in the next api version. So we have to check if this notification is handled by us.
                //console.log('\nc.serverTimestamp is :', c.serverTimestamp)
                //console.log('\nopenConvs[c.dialogId].joined value :', openConvs[c.dialogId].joined )
                if (openConvs[c.dialogId]) {
                    // add to respond list all content event not by me
                    if (c.event.type === 'ContentEvent' && c.originatorMetadata.role === 'CONSUMER' //) {
                        && c.serverTimestamp > openConvs[c.dialogId].joined) {
                        respond[`${body.dialogId}-${c.sequence}`] = {
                            dialogId: body.dialogId,
                            sequence: c.sequence,
                            message: c.event.message
                        };
                    }
                    // remove from respond list all the messages that were already read
                    if (c.event.type === 'AcceptStatusEvent' && c.originatorId === this.agentId) {
                        c.event.sequenceList.forEach(seq => {
                            delete respond[`${body.dialogId}-${seq}`];
                        });
                    }
                }
            });

            // publish read, and echo
            Object.keys(respond).forEach(key => {
                var contentEvent = respond[key];
                this.publishEvent({
                    dialogId: contentEvent.dialogId,
                    event: {type: "AcceptStatusEvent", status: "READ", sequenceList: [contentEvent.sequence]}
                });
                this.emit(this.CONTENT_NOTIFICATION, contentEvent);
            });
        });

        // Tracing
        //this.on('notification', msg => console.log('got message', msg));
        this.on('error', err => console.log('got an error', err));
        this.on('closed', data => console.log('socket closed', data));
    }
}

module.exports = MyCoolAgent;
