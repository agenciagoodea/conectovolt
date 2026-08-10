class ApiConfig {
  // Override with --dart-define=API_BASE_URL=... for physical devices and production.
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1',
  );
  static const String ocppWsUrl = String.fromEnvironment(
    'OCPP_WS_URL',
    defaultValue: 'ws://10.0.2.2:3001',
  );
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}
