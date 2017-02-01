const http = require('http');
const express = require('express');
const app = express();
const serveStatic = require('serve-static');
const getVisualization = require('./getVisualization');
const PORT = 3002;
