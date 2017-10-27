const fs = require('fs');
const TaskSharding = require('task-sharding').TaskSharding;
const MyCoolAgent = require('./../agent-bot/MyCoolAgent');
var request = require('request');
const zkConnStr = `${process.env.ZK_PORT_2181_TCP_ADDR}:${process.env.ZK_PORT_2181_TCP_PORT}`;
var watsonAnswer = ''
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
            var myUrl = `http://169.60.13.110:1880/liveperson?user_id=${contentEvent.dialogId}&workspace_id=a003413f-2973-4dba-b1ba-550b3fa09a71&text=\'${contentEvent.message}\'&fname=dennis`
            console.log('Web Request ', myUrl)
            request.post(myUrl, function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Return from WCS
                watsonAnswer = body
               
            newAgent.publishEvent({
                  dialogId: contentEvent.dialogId,
                  event: {
                    type: 'ContentEvent',
                    contentType: 'text/plain',
              //      message: `response from ${this.conf.id} message from user ${contentEvent.message}`
                      message : watsonAnswer
                  }
            });


            if (watsonAnswer.lastIndexOf("transfer you to") >= 0) {
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
                
            });         
        }
    });
    
    newAgent.on('close', function() {
        console.log(`closed connection for ${this.conf.id}`);
    });
    return newAgent;
}
