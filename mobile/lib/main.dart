import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'core/theme/app_theme.dart';
import 'presentation/auth/screens/login_screen.dart';
import 'presentation/map/screens/map_screen.dart';
import 'presentation/stations/screens/station_detail_screen.dart';
import 'presentation/charging/screens/charging_screen.dart';
import 'presentation/payment/screens/payment_screen.dart';
import 'presentation/history/screens/history_screen.dart';

final router = GoRouter(
  initialLocation: '/map',
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/map', builder: (_, __) => const MapScreen()),
    GoRoute(path: '/station/:id', builder: (_, state) => StationDetailScreen(stationId: state.pathParameters['id']!)),
    GoRoute(path: '/charging/start', builder: (_, state) => ChargingScreen(
      chargerId: state.uri.queryParameters['charger']!,
      stationId: state.uri.queryParameters['station']!,
    )),
    GoRoute(path: '/payment', builder: (_, state) => PaymentScreen(
      sessionId: state.uri.queryParameters['session']!,
      amount: double.tryParse(state.uri.queryParameters['amount'] ?? '0') ?? 0,
    )),
    GoRoute(path: '/history', builder: (_, __) => const HistoryScreen()),
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
