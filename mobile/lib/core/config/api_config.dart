class ApiConfig {
  static const String baseUrl = 'http://10.0.2.2:3000/api/v1';
  static const String ocppWsUrl = 'ws://10.0.2.2:3001';
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}
