export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'Plain JS test working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
} 