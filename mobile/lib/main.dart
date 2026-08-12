import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'core/theme/app_theme.dart';
import 'presentation/auth/screens/login_screen.dart';
import 'presentation/auth/screens/register_screen.dart';
import 'presentation/map/screens/map_screen.dart';
import 'presentation/stations/screens/station_detail_screen.dart';
import 'presentation/charging/screens/charging_screen.dart';
import 'presentation/payment/screens/payment_screen.dart';
import 'presentation/history/screens/history_screen.dart';
import 'presentation/profile/screens/profile_screen.dart';

final router = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/map', builder: (_, __) => const MapScreen()),
    GoRoute(path: '/station/:id', builder: (_, state) {
      final id = state.pathParameters['id'];
      return id == null ? const InvalidRouteScreen() : StationDetailScreen(stationId: id);
    }),
    GoRoute(path: '/charging/start', builder: (_, state) {
      final charger = state.uri.queryParameters['charger'];
      final station = state.uri.queryParameters['station'];
      return charger == null || station == null
          ? const InvalidRouteScreen()
          : ChargingScreen(chargerId: charger, stationId: station, connectorId: state.uri.queryParameters['connector']);
    }),
    GoRoute(path: '/payment', builder: (_, state) {
      final session = state.uri.queryParameters['session'];
      return session == null
          ? const InvalidRouteScreen()
          : PaymentScreen(sessionId: session, amount: double.tryParse(state.uri.queryParameters['amount'] ?? '0') ?? 0);
    }),
    GoRoute(path: '/history', builder: (_, __) => const HistoryScreen()),
    GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
  ],
);

void main() {
  runApp(const ProviderScope(child: ConectoVoltApp()));
}

class ConectoVoltApp extends StatelessWidget {
  const ConectoVoltApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'ConectoVolt',
      theme: AppTheme.darkTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}

class InvalidRouteScreen extends StatelessWidget {
  const InvalidRouteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Link invalido ou expirado.', style: TextStyle(color: Colors.white)),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: () => context.go('/map'), child: const Text('Voltar aos postos')),
          ],
        ),
      ),
    );
  }
}
