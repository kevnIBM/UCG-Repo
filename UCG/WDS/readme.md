Watson Discovery Services Edition

Our mission: to build the ultimate conversation framework to orchestrate services into patterned flows for NLP/AI systems. Today we support IBM Watson.
![Cloud Enterprise UCG](https://github.com/dennisnotojr/UCG-Repo/blob/master/UCG/Images/Cloud-UCG.jpeg)


Repo Directory Structure

DataDocs - Assorted files for loading content and traning data
 

Steps to use Intergration

1) Sign on to bluemix and create an Advanced Watson Discovery Service
2) Launch the WDS tooling and create a collection
3) If its your first collection give it a name and selete the default config
4) Click on the collection, under configuration, click switch, click "create a new config"
5) Once in configuration editor, click Enrich
    a) Add two fields "Key" and "Text"
    b) Add all enrichments except "element classification" - it requires PDFs and we aren't dealing this that yet.
6) Click save and close
7) Go back into the collection, under configuration, click switch and choose your new config. This will be the defualt for all uploads
8) Under collection info, click "Use this collection in API", copy all ids
        
	Example
        Collection Id
		06bca61b-6cad-4573-a618-215aexxxxxxx
		
		Configuration Id
		1d573129-7100-4405-b6a0-439cdxxxxxxx
		
		Environment Id
		d40ba5ee-be86-4b59-8a67-f463fxxxxxxx

9) Go to the node-red console, click on the UCG Discovery flow
     a) In most of the function nodes you will see vars for the ids, please replace values

     b) add credentials - get the credentials by clicking on the service in bluemix and selecting "Service credentials"
          In the http-request nodes set username/password
          In the function nodes that use the Discover NodeSDK, update the username and password vars

 NOW YOU ARE READY TO UPLOAD CONTENT and ML TRAIN NL QUESTIONS

 1) I have provided a Terms.csv file to use with the Auto upload flow in the Discovery tab, just make sure the file and flow vars are set and you can click inject
 2) After the content is loaded, you can upload the training data. I have provided a TrainingQueries.csv touse with the Auto upload training data flow in the Discovery tab, click inject after vars and file are changed.
 3) If all goes well you can use the search flow to ask NP Questions located at the top of the Discovery tab.

 Executing the upload via CURL via your mac

 cd WDS/DataDocs 

 For Training Queries

    curl -F "file=@Articles_TrainingQueries.csv" http://ucg-cluster-dev.us-south.containers.mybluemix.net/LoadWDSTrainingData

 For Content:

    curl -F "file=@Articles.csv" http://ucg-cluster-dev.us-south.containers.mybluemix.net/LoadWDSContent

For Handling Answers from WDS

UCG_ANSWER_ROUTING - allows WCS engineers to change the answer routing. Set a context var in the conversation start
Example: UCG_ANSWER_ROUTING = WCS-WDS-WCS

  Possible Values:
    WCS-WDS     - the default routing(Don't need to set) that uses a canned answer via an enrich function node in the SOE flow that overrides WCS when an irrelevant utterance is detected.

    WCS-WDS-WCS - routes back through WCS after calling WDS with new context vars
              WDSResults - JSON object with payload from WDS

    Must add the following to WCS:

    1. Add Intent ProcessWDS Answer with utterance "Process WDS Answer"
    2. Add Dialog node "Handle WDS Ansers from UCG"
        Add Responses 
         If Bot recongnizes
         
         $WDSResults.results[0].Type == "Article"

        Respond with in JSON editor
         
         {"output": {"text": [
            "I found this article titled , <? $WDSResults.results[0].Key?>, that might interest you.",
            "UCGWDSANSWER",
            "Any other questions?"
          ]}}

        If Bot recognizes
         $WDSResults.results[0].Type == "Term" 

        Respond with - in JSON editor

         {"output": {"text": [
            "I found this term, <? $WDSResults.results[0].Key?>, in my glossary.",
            "UCGWDSANSWER",
            "Any other questions?"
          ]}} 

Notes:
1) The tag "UCGWDSANSWER" is used to place the output array from WDS anywhere in the WCS output array.  
2) Fields from $WDSResults can be referenced from the context - run an query in WDS and view the JSON output to see possible values. 


