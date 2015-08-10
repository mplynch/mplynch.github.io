'use strict';
angular.module('myApp.datastub.datastub-service', [])

.factory('datastub', function() {
  var service = {};

  service.types = [{
    "text": "Health, Safety, Environmental",
    "value": "HSE"
  }, {
    "text": "Quality",
    "value": "Quality",
  }, {
    "text": "Other",
    "value": "Other"
  }];

  service.actiontypes = [{
    "text": "Continual Improvement",
    "value": "Continual Improvement"
  }, {
    "text": "Corrective",
    "value": "Corrective"
  }, {
    "text": "Ergonomic",
    "value": "Ergonomic"
  }, {
    "text": "Other",
    "value": "Other"
  }, {
    "text": "Preventative",
    "value": "Preventative"
  }, {
    "text": "Positive Feedback",
    "value": "Positive Feedback"
  }];

  service.sources = [{
    "text": "Customer",
    "value": "Customer"
  }, {
    "text": "Employee Observation",
    "value": "Employee Observation"
  }, {
    "text": "External Audit",
    "value": "External Audit"
  }, {
    "text": "Incident Investigation",
    "value": "Incident Investigation"
  }, {
    "text": "Internal Audit",
    "value": "Internal Audit"
  }, {
    "text": "Management Review",
    "value": "Management Review"
  }, {
    "text": "Other",
    "value": "Other"
  }, {
    "text": "Safety Walkthrough",
    "value": "Safety Walkthrough"
  }, {
    "text": "SER",
    "value": "SER"
  }, {
    "text": "Supplier",
    "value": "Supplier"
  }];

  service.supervisors = [{
    "name": "John Doe"
  }, {
    "name": "Jimmy Doe"
  }, {
    "name": "Jane Doe"
  }, {
    "name": "G.I. Joe"
  }];

  service.suggestions = [{
    "actiontype": "Ergonomic",
    "source": "Employee Observation",
    "summary": "My back hurts",
    "description": "It really, really hurts!",
    "supervisor": "Jimmy Doe"
  }, {
    "actiontype": "Positive Feedback",
    "source": "Employee Observation",
    "summary": "That guy did a great job.",
    "description": "A really, really great job!",
    "supervisor": "John Doe"
  }];

  service.AddSuggestion = function(suggestion) {
    service.suggestions.push(suggestion);
  };

  return service;
});
