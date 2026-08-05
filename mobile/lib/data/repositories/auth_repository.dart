import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/services/api_service.dart';
import '../models/models.dart';

final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<UserModel?>>((ref) {
  return AuthNotifier(ref.read(apiServiceProvider));
});

class AuthNotifier extends StateNotifier<AsyncValue<UserModel?>> {
  final ApiService _api;

  AuthNotifier(this._api) : super(const AsyncValue.loading()) {
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final token = await _api.getAccessToken();
    if (token == null) { state = const AsyncData(null); return; }
    try {
      final response = await _api.dio.get('/auth/profile');
      state = AsyncData(UserModel.fromJson(response.data));
    } catch (_) {
      state = const AsyncData(null);
    }
  }

  Future<UserModel> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final response = await _api.dio.post('/auth/login', data: {'email': email, 'password': password});
      await _api.saveTokens(response.data['access_token'], response.data['refresh_token']);
      final user = UserModel.fromJson(response.data['user']);
      state = AsyncData(user);
      return user;
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<UserModel> register(String name, String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final response = await _api.dio.post('/auth/register', data: {'name': name, 'email': email, 'password': password});
      await _api.saveTokens(response.data['access_token'], response.data['refresh_token']);
      final user = UserModel.fromJson(response.data['user']);
      state = AsyncData(user);
      return user;
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      rethrow;
    }
  }

  Future<void> logout() async {
    await _api.clearTokens();
    state = const AsyncData(null);
  }
}
