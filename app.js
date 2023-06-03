require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./routes');
const cors = require('cors');
const Sentry = require('@sentry/node');

const { HTTP_PORT = 3000, SENTRY_DSN, APP_ENV } = process.env;

Sentry.init({
	environment: APP_ENV,
	dsn: SENTRY_DSN,
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Sentry.Integrations.Express({ app }),
		// Automatically instrument Node.js libraries and frameworks
		...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
	],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('images', express.static('./public/images'));

app.use(router);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// 500
app.use((err, req, res, next) => {
	console.log(err);
	return res.status(500).json({
		status: false,
		message: err.message,
		data: null,
	});
});

module.exports = app;
