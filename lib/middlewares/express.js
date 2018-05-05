'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = agendash => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use('/', express.static(path.join(__dirname, '../../public')));

  app.get('/api', (req, res) => {
    agendash.api(req.query.job, req.query.state, (err, apiResponse) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.json(apiResponse);
    });
  });

  app.post('/api/jobs/requeue', (req, res) => {
    agendash.requeueJobs(req.body.jobIds, (err, newJobs) => {
      if (err || !newJobs) {
        return res.status(404).json(err);
      }
      res.json(newJobs);
    });
  });

  app.post('/api/jobs/delete', (req, res) => {
    agendash.deleteJobs(req.body.jobIds, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({deleted: true});
    });
  });

  app.post('/api/jobs/create', (req, res) => {
    agendash.createJob(req.body.jobName, req.body.jobSchedule, req.body.jobRepeatEvery, req.body.jobData, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({created: true});
    });
  });

  //定义任务
  app.post('/api/jobs/define', (req, res) => {
    agendash.defineJob(req.body.name, req.body.url, req.body.method, req.body.callback, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({created: true});
    });
  });




  //definition  api
  app.get('/api/definitions', (req, res) => {
    agendash.definitions(req.query.definition, req.query.state, (err, apiResponse) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.json(apiResponse);
    });
  });

  // app.post('/api/definitions/update', (req, res) => {
  //   agendash.updateDefinitions(req.body.definitionIds, (err, newDefinitions) => {
  //     if (err || !newDefinitions) {
  //       return res.status(404).json(err);
  //     }
  //     res.json(newDefinitions);
  //   });
  // });

  app.post('/api/definitions/delete', (req, res) => {
    agendash.deleteDefinitions(req.body.definitionNames, err => {
      if (err) {
        return res.status(404).json(err);
      }else {
        return res.json({deleted: true});
      }
    });
  });

  app.post('/api/definitions/define', (req, res) => {
    agendash.defineDefinition(req.body.name, req.body.url, req.body.method, req.body.callback, err => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json({created: true});
    });
  });



  return app;
};
