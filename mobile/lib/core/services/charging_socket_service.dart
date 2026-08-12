import 'dart:async';
import 'dart:convert';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/api_config.dart';
import '../services/api_service.dart';

enum SocketStatus { disconnected, connecting, connected, error }

class ChargingSocketService {
  io.Socket? _socket;
  final ApiService _api;
  SocketStatus _status = SocketStatus.disconnected;
  final _statusController = StreamController<SocketStatus>.broadcast();
  final _sessionController = StreamController<Map<String, dynamic>>.broadcast();
  final _chargerUpdateController = StreamController<Map<String, dynamic>>.broadcast();
  final _errorController = StreamController<String>.broadcast();

  Stream<SocketStatus> get statusStream => _statusController.stream;
  Stream<Map<String, dynamic>> get sessionStream => _sessionController.stream;
  Stream<Map<String, dynamic>> get chargerUpdateStream => _chargerUpdateController.stream;
  Stream<String> get errorStream => _errorController.stream;
  SocketStatus get currentStatus => _status;

  ChargingSocketService(this._api);

  Future<void> connect() async {
    if (_socket?.connected == true) return;

    _updateStatus(SocketStatus.connecting);

    final token = await _api.getAccessToken();
    if (token == null) {
      _updateStatus(SocketStatus.error);
      _errorController.add('Nao autenticado');
      return;
    }

    final baseUrl = ApiConfig.baseUrl.replaceAll('/api/v1', '');

    _socket = io.io(
      '$baseUrl/charging',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .enableAutoConnect()
          .enableReconnection()
          .setReconnectionDelay(3000)
          .setReconnectionAttempts(10)
          .setAuth({'token': token})
          .build(),
    );

    _socket!.onConnect((_) {
      _updateStatus(SocketStatus.connected);
    });

    _socket!.onDisconnect((_) {
      _updateStatus(SocketStatus.disconnected);
    });

    _socket!.onConnectError((error) {
      _updateStatus(SocketStatus.error);
      _errorController.add('Erro de conexao: $error');
    });

    _socket!.onError((error) {
      _errorController.add('Erro: $error');
    });

    _socket!.on('session:started', (data) {
      if (data is Map<String, dynamic>) {
        _sessionController.add({...data, 'event': 'started'});
      }
    });

    _socket!.on('session:update', (data) {
      if (data is Map<String, dynamic>) {
        _sessionController.add({...data, 'event': 'update'});
      }
    });

    _socket!.on('session:completed', (data) {
      if (data is Map<String, dynamic>) {
        _sessionController.add({...data, 'event': 'completed'});
      }
    });

    _socket!.on('charger:update', (data) {
      if (data is Map<String, dynamic>) {
        _chargerUpdateController.add(data);
      }
    });

    _socket!.on('notification', (data) {
      if (data is Map<String, dynamic>) {
        _sessionController.add({...data, 'event': 'notification'});
      }
    });

    _socket!.connect();
  }

  void subscribeUser(String userId) {
    _socket?.emit('subscribe:user', userId);
  }

  void subscribeStation(String stationId) {
    _socket?.emit('subscribe:station', stationId);
  }

  void subscribeSession(String sessionId) {
    _socket?.emit('subscribe:session', sessionId);
  }

  void unsubscribeSession(String sessionId) {
    _socket?.emit('unsubscribe:session', sessionId);
  }

  void sendHeartbeat({required String chargerId, required String sessionId}) {
    _socket?.emit('heartbeat', {
      'chargerId': chargerId,
      'sessionId': sessionId,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void _updateStatus(SocketStatus status) {
    _status = status;
    _statusController.add(status);
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _updateStatus(SocketStatus.disconnected);
  }

  void dispose() {
    disconnect();
    _statusController.close();
    _sessionController.close();
    _chargerUpdateController.close();
    _errorController.close();
  }
}

final chargingSocketProvider = Provider<ChargingSocketService>((ref) {
  final api = ref.read(apiServiceProvider);
  final service = ChargingSocketService(api);
  ref.onDispose(() => service.dispose());
  return service;
});
