#!/usr/bin/env node
'use strict';
const http = require('http');
const Agenda = require('agenda');
const express = require('express');
const program = require('commander');
const settings=require('../settings')
const basicAuth = require('basic-auth-connect');

program
  .option('-d, --db <db>', '[required] Mongo connection string, same as Agenda connection string')
  .option('-c, --collection <collection>', '[optional] Mongo collection, same as Agenda collection name, default agendaJobs', 'agendaJobs')
  .option('-p, --port <port>', '[optional] Server port, default 3000', (n, d) => Number(n) || d, settings.port)
  .option('-t, --title <title>', '[optional] Page title, default Agendash', 'Agendash')
  .parse(process.argv);

if (!program.db) {
  // console.error('--db required');
  // process.exit(1);
    program.db=settings.mongodb
}

const app = express();

const agenda = new Agenda().database(program.db, program.collection);
app.use(function (req,res,next) {
    let token = req.headers.token
    if(token===settings.token){
        next()
    }else{
        basicAuth(function(user, pass){
            return settings.user == user && settings.pass == pass;
        })(req,res,next)
    }
})
app.use('/', require('../app')(agenda, {
  title: program.title
}));

app.set('port', program.port);

const server = http.createServer(app);
server.listen(program.port, () => {
  console.log(`Agendash started http://localhost:${program.port}`);
});
