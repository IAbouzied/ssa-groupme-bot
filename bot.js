//jshint esversion: 6

var HTTPS = require('https');

var botID = process.env.BOT_ID;

var imageUrls = {
  benStillerImage: "https://i.groupme.com/199x212.jpeg.dc882ad81724453398237fb8cd23620d'",
  mango1: "https://i.groupme.com/512x512.jpeg.7ffb11da0be14ced9f060573e4e70927",
  mango2: "https://i.groupme.com/512x512.jpeg.85fff75b16244668aae4e36cbb7bb937",
  mango3: "https://i.groupme.com/512x512.jpeg.7f676d6217464734b6b9d85eaffc9ec6",
  mango4: "https://i.groupme.com/512x512.jpeg.8b109a8595744866a678f508600f0bc4",
  mango5: "https://i.groupme.com/512x512.jpeg.9a38932f66884f79aadc2364f66a9013"
};

var stage = 1;

var userIds = {
  luisUserId: "24104270",
  tarekUserId: "31433361",
};

var lastMentionResponseTime = 0;

var mentionResponses = [
  "I have an exam coming up so I can't really talk right now :(",
  "Lets talk next meeting",
  "I'm willing to talk about this but I don't like groupme shoot me a text",
  "Phones about to die I'll follow up later",
  "Driving rn",
];

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;

  console.log(request);
  if (request.sender_type != "bot") {
    if(request.text && botRegex.test(request.text)) {
      this.res.writeHead(200);
      postMessage("Suhh dude");
      this.res.end();
    } else if (request.text) {
      if (checkBotMention(request.text)) {
        setTimeout(botMentionResponse, 7 *1000, request.text, request);
      } else if (checkCussWords(request.text)) {
        postMessage("Excuse me!!1! This is a Christian minecraft server. Please keep satan language to a minimum. Thank you.");
      } else if (checkLookAtThisDood(request.text)) {
        postMessage("https://www.youtube.com/watch?v=ZXWI9oINBpA", request);
      } else if (isLuisABitch(request.text) && request.user_id == userIds.luisUserId) {
        postMessage("Luis stop being a lil bitch.");
      } else if (request.text.toLowerCase() === "grow" && request.user_id == userIds.tarekUserId) {
        growMangoTree(request);
      } else if (checkSamHarris(request.text)) {
        postMessage("", request, imageUrls.benStillerImage);
      } else if (doesJoeRoganJoinChat(request.text)) {
        postMessage("Joe Rogan has joined the chat.");
      } else if (checkAskingAboutMeeting(request.text)) {
        postMessage("SSA Meetings are Wednesdays 5:30-6:30pm in PAR 105");
      } else if (checkBlackHole(request.text)) {
        postMessage("I am glad to see you are a holes of color ally.");
      }
    } else {
      this.res.writeHead(200);
      this.res.end();
    }
  }
}

// OUR CHECKS

function checkCussWords(text) {
  var cussCount = (text.toLowerCase().match(/fuck/g) || []).length;
  cussCount += (text.toLowerCase().match(/shit/g) || []).length;
  cussCount += (text.toLowerCase().match(/bitch/g) || []).length;

  if (cussCount >= 3) {
    return true;
  }
  return false;
}

function doesJoeRoganJoinChat(text) {
  var txt = text.toLowerCase();
  if (txt.indexOf("dmt") > -1 || txt.indexOf("cbd") > -1 || txt.indexOf("shroom") > -1) {
    return true;
  }
  return false;
}

function isLuisABitch(text) {
  return text.toLowerCase().indexOf("i hate") > -1;
}

function checkLookAtThisDood(text) {
  return text.toLowerCase().match(/dood/);
}

function checkSamHarris(text) {
  return text.toLowerCase().indexOf("sam harris") > -1;
}

function growMangoTree(request) {

  switch (stage) {
    case 1:
      postMessage("A wild mango tree has appeared!", request, imageUrls.mango1);
      stage++;
      break;
    case 2:
      postMessage("The baby mango tree transforms himself into adolescence! Unfortunately, his peers still think he is a loser for he has no mangos yet.", request, imageUrls.mango2);
      stage++;
      break;
    case 3:
      postMessage("Amazing! Despite being orphaned at birth, the mango tree continues to grow thanks to his new gentle caregiver.", request, imageUrls.mango3);
      stage++;
      break;
    case 4:
      postMessage("Success!! Mangos start to grow! Sadly, not enough mangos to feed the nearby village, which is currently suffering under the cruel fist of fascism.", request, imageUrls.mango4);
      stage++;
      break;
    case 5:
      postMessage("You did it!! The mango tree grew enough mangos to feed the village. All of the mango tree's friends apologized and everyone is happy. All thanks to the one and only Luis!", request, imageUrls.mango5);
      stage = 1;
      break;
    default:
      stage = 1;
      postMessage("uh oh, the mango tree needs more help. Try again!", request);
      break;
  }

}

function checkAskingAboutMeeting(text) {
  var meetingRegex = /[what\stime|when|where].+meeting/;
  return meetingRegex.test(text.toLowerCase());
}

function checkBlackHole(text) {
  var regex = /black\shole/;
  return regex.test(text.toLowerCase());
}

function checkBotMention(text) {
  var regex = /@cameron/
  return regex.test(text.toLowerCase());
}

function botMentionResponse(text, request) {
  var sexualWordsRegex = /sex|blowjob|naked|suck\smy\sdick|fuck\sme|girlfriend|boyfriend|gay|lesbian/;


  var delay = 7 * 60;
  if (sexualWordsRegex.test(text.toLowerCase())) {
    postMessage("Umm I don't talk to perverts", request);
  }
  else if (request.created_at > lastMentionResponseTime + delay) {
    lastMentionResponseTime = request.created_at;
    postMessage(mentionResponses[Math.floor(Math.random() * mentionResponses.length)], request);
  } else {
    console.log("Need to wait " + (lastMentionResponseTime + delay - request.created_at));
  }
}

function mention(userId, name) {
  var nameLength = name.length;
  var attachments = {
    "type":"mentions",
    "user_ids":[
      userId
    ],
    "loci":[
      [0,nameLength + 1]
    ]
  };

  return attachments;
}

function image(url) {
  var attachments = {
    "type": "image",
    "url": url,
  };

  return attachments;
}



function postMessage(responseText, request, imageUrl) {
  request = request || null;
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  if (request == null) {
    body = {
      "bot_id" : botID,
      "text" : responseText
    };
  } else {
    body = {
      "attachments" : [mention(request.user_id, request.name),],
      "bot_id" : botID,
      "text" : "@" + request.name + " " + responseText
    };
  }
  if (imageUrl) {
    body.attachments.push(image(imageUrl));
  }


  console.log('sending ' + responseText + ' to ' + botID);
  console.log(body);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
