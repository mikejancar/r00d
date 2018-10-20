'use strict';

const Alexa = require('ask-sdk');
const CONSTANTS = require('./constants');
const SpeechText = require('./speech-text');

const cardTitle = 'r00d';

let skill;

exports.handler = async function (event, context) {
  console.log(`REQUEST: ${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        GreetingIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  return skill.invoke(event,context);
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === CONSTANTS.requestTypes.launch;
    },
    handle(handlerInput) {
        const speechText = SpeechText.introductions.hi;

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(cardTitle, 'Hello')
            .getResponse();
    }
};

const GreetingIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === CONSTANTS.requestTypes.intent
            && handlerInput.requestEnvelope.request.intent.name === 'GreetingIntent';
    },
    handle(handlerInput) {
        const speechText = SpeechText.greetings.howdy;

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(cardTitle, 'Howdy!')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === CONSTANTS.requestTypes.intent
            && handlerInput.requestEnvelope.request.intent.name === CONSTANTS.intentTypes.help;
    },
    handle(handlerInput) {
        const speechText = 'What\'s your problem?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(cardTitle, 'What\'s your problem?')
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === CONSTANTS.requestTypes.intent
            && (handlerInput.requestEnvelope.request.intent.name === CONSTANTS.intentTypes.cancel
                || handlerInput.requestEnvelope.request.intent.name === CONSTANTS.intentTypes.stop);
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(cardTitle, speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === CONSTANTS.requestTypes.sessionEnded;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);

      return handlerInput.responseBuilder
        .speak('<p><say-as interpret-as="interjection">ruh roh</say-as></p>')
        .reprompt('I give up!')
        .getResponse();
    },
};