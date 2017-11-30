const fs = require('fs');
const TaskSharding = require('task-sharding').TaskSharding;
const MyCoolAgent = require('./../agent-bot/MyCoolAgent');
//******** DFN code ***********
var request = require('request');
var watsonAnswer = [];

//*****************************

const zkConnStr = `${process.env.ZK_PORT_2181_TCP_ADDR}:${process.env.ZK_PORT_2181_TCP_PORT}`;
const allAgents =
    JSON.parse(fs.readFileSync(process.env.BOT_CONFIG_FILE, 'utf8')) // read file
        .map(agentInfo => { // add id
            agentInfo.id = `${agentInfo.accountId}-${agentInfo.username}`;
            return agentInfo;
        });

const taskSharding = new TaskSharding(zkConnStr, allAgents);

taskSharding.on('taskAdded', (newAgentConf, taskInfoAdder) => {
    console.log(`add ${newAgentConf.id}`);

    // create a new Agent Connection and store it in the taskSharging store
    taskInfoAdder(createNewAgent(newAgentConf));
});

taskSharding.on('taskRemoved', (oldTaskInfo) => {
    console.log(`remove ${oldTaskInfo.conf.id}`);
    oldTaskInfo.dispose();
});

function createNewAgent(newAgentConf) {
    const newAgent = new MyCoolAgent(newAgentConf);
    newAgent.on('MyCoolAgent.ContentEvnet', function(contentEvent) {
        if (contentEvent.message.startsWith('#close')) {
            newAgent.updateConversationField({
                conversationId: contentEvent.dialogId,
                conversationField: [{
                    field: "ConversationStateField",
                    conversationState: "CLOSE"
                }]
            });
        } else {
            //Add call to NodeRed 
            var myUrl = `http://${process.env.ucg_domain}/liveperson?user_id=${contentEvent.dialogId}&wcs_username=${process.env.wcs_username}&wcs_password=${process.env.wcs_password}&workspace_id=${process.env.workspace_id}&text=\'${contentEvent.message}\'&fname=dennis`
            console.log('Web Request ', myUrl)
            request.post(myUrl, function (error, response, body) {
             //   console.log('error:', error); // Print the error if one occurred
             //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
             //   console.log('body:', body); // Return from WCS
             //   watsonAnswer = body
                watsonAnswer = JSON.parse(body);
                 console.log('watsonAnswer:', JSON.stringify(watsonAnswer));
            var i = 0;
            var transfer = "no"
            if (typeof watsonAnswer.text !== "undefined") {
             
             for (i = 0; i < watsonAnswer.text.length; i++) {

               if (watsonAnswer.text[i].lastIndexOf("transfer you to") >= 0) {
                transfer = "yes"
               } 
 
               newAgent.publishEvent({
                    dialogId: contentEvent.dialogId,
                    event: {
                      type: 'ContentEvent',
                      contentType: 'text/plain',
              //       message: `response from ${this.conf.id} message from user ${contentEvent.message}`
                      message : watsonAnswer.text[i]
                    }
               });
            
             }


            } 
            
            if (typeof watsonAnswer.content !== "undefined") {
              for (i = 0; i < watsonAnswer.content.elements[0].text.length; i++) {

                 if (watsonAnswer.content.elements[0].text[i].lastIndexOf("transfer you to") >= 0) {
                   transfer = "yes"
                 }
                  console.log('i is ' + i + ' array length is ' + watsonAnswer.content.elements[0].text.length )
                 
                 if ((i+1) == (watsonAnswer.content.elements[0].text.length)) {
                    var saveLast = watsonAnswer.content.elements[0].text[i]
                    watsonAnswer.content.elements[0].text = saveLast
                    i = 1000
                    console.log('index content before at last :', JSON.stringify(watsonAnswer.content)); 
                    newAgent.publishEvent({
                        dialogId: contentEvent.dialogId,
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
                    
                    console.log('index content at each turn :', watsonAnswer.content.elements[0].text[i]); 
                    newAgent.publishEvent({
                      dialogId: contentEvent.dialogId,
                      event: {
                        type: 'ContentEvent',
                        contentType: 'text/plain',
                        message : watsonAnswer.content.elements[0].text[i]
                      }
                    });


                 }
            
             }
            
            }
            


            if (transfer == "yes") {
                newAgent.updateConversationField({
                    conversationId: contentEvent.dialogId,
                    conversationField: [{ field: "ParticipantsChange",
                                          type: "REMOVE",
                                          role: "ASSIGNED_AGENT"
                                        },
                                        { field: "Skill",
                                              type: "UPDATE",
                                              skill: "283956014"
                                        }]
                }, function(err) { 
                           if(err) {console.log('Transfer to agent failed:',err)}
                    }
                )
            }
         })
        }
    });
    
    newAgent.on('close', function() {
        console.log(`closed connection for ${this.conf.id}`);
        createNewAgent(this.conf);
    });
    newAgent.on('closed', function() {
        console.log(`closed connection for ${this.conf.id}`);
        createNewAgent(this.conf);
    });
    newAgent.on('error', function() {
        console.log(`error on connection for ${this.conf.id}`);
        createNewAgent(this.conf);
    });
    return newAgent;
}
