// Logger middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;
    
    // Color coding based on status
    const statusColor = status >= 500 ? '\x1b[31m' : // Red for 5xx
                       status >= 400 ? '\x1b[33m' : // Yellow for 4xx
                       status >= 300 ? '\x1b[36m' : // Cyan for 3xx
                       '\x1b[32m'; // Green for 2xx
    
    console.log(
      `${timestamp} | ${statusColor}${status}\x1b[0m | ${method} ${url} | ${duration}ms`
    );
  });
  
  next();
};

// API analytics logger
export const analyticsLogger = (req, res, next) => {
  // Log API endpoint hits for analytics
  const endpoint = req.originalUrl.split('?')[0];
  const method = req.method;
  
  // Store in memory (in production, use Redis or database)
  if (!global.apiStats) {
    global.apiStats = {};
  }
  
  const key = `${method}:${endpoint}`;
  global.apiStats[key] = (global.apiStats[key] || 0) + 1;
  
  next();
};

// Get API statistics
export const getApiStats = (req, res) => {
  const stats = global.apiStats || {};
  const sortedStats = Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  
  res.json({
    totalRequests: Object.values(stats).reduce((sum, count) => sum + count, 0),
    endpoints: sortedStats
  });
};
