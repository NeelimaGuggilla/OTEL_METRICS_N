import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
/*import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';*/
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';

const provider = new WebTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
});

provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [
      new DocumentLoadInstrumentation(),
      new UserInteractionInstrumentation(),
      new XMLHttpRequestInstrumentation()
  ],
});

// Set up the MeterProvider with the exporter
const meterProvider = new MeterProvider({
  readers: [new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
    exportIntervalMillis: 1000, // Export metrics every second
  })],
});

// Initialize meter provider (this is where you collect custom metrics)
const meter = meterProvider.getMeter('browser-metrics');

// Example of creating a simple counter metric
/*const pageLoadCounter = meter.createCounter('page_loads', {description: 'Counts the number of page loads',});*/

// Optional: Example of adding more metrics, like duration or custom timing
const pageLoadDuration = meter.createHistogram('page_load_duration', {description: 'Measures the time it takes to load the page',});

// Simulate recording a metric (since we can't use `window` in Node.js)
const simulateLoadTime = () => {
  const loadTime = Math.random() * 1000; // Simulate a random page load time between 0 and 1000ms
  pageLoadDuration.record(loadTime);
  console.log(`Simulated page load in ${loadTime.toFixed(2)} milliseconds`);
  console.log(`Metric Recorded: page_load_duration = ${loadTime.toFixed(2)} ms`);
};

// Simulate a load event every 5 seconds
setInterval(simulateLoadTime, 10000);
 


/*// Example of tracking page loads as a metric
window.addEventListener('load', () => {
  pageLoadCounter.add(1); // Increment the counter by 1 every time the page is loaded
});*/


// Start measuring page load duration
/*const startTime = performance.now();

// Example of recording the time it takes for the page to load
window.addEventListener('load', () => {
  const endTime = performance.now();
  durationHistogram.record(endTime - startTime);
});*/

/*// Set up the OTLP exporter
const exporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics', // Replace with your OTLP endpoint
});

// Create custom metrics for browser performance
const fcpHistogram = meter.createHistogram('fcp', {description: 'First Contentful Paint time',});
const lcpHistogram = meter.createHistogram('lcp', {description: 'Largest Contentful Paint time',});
const ttiHistogram = meter.createHistogram('tti', {description: 'Time to Interactive',});

// Use the PerformanceObserver API to collect and record browser performance
if (typeof window !== 'undefined') {
  // Track First Contentful Paint (FCP)
  new PerformanceObserver((entryList) => {
    entryList.getEntriesByName('first-contentful-paint').forEach((entry) => {
      fcpHistogram.record(entry.startTime);
    });
  }).observe({ type: 'paint', buffered: true });

  // Track Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    entryList.getEntriesByName('largest-contentful-paint').forEach((entry) => {
      lcpHistogram.record(entry.startTime);
    });
  }).observe({ type: 'largest-contentful-paint', buffered: true });

  // Track Time to Interactive (TTI)
  new PerformanceObserver((entryList) => {
    entryList.getEntriesByName('interactive').forEach((entry) => {
      ttiHistogram.record(entry.startTime);
    });
  }).observe({ type: 'navigation', buffered: true });
}
*/






