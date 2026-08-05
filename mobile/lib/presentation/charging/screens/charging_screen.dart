import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/services/api_service.dart';
import '../../../core/theme/app_theme.dart';

class ChargingScreen extends ConsumerStatefulWidget {
  final String chargerId;
  final String stationId;
  const ChargingScreen({super.key, required this.chargerId, required this.stationId});

  @override
  ConsumerState<ChargingScreen> createState() => _ChargingScreenState();
}

class _ChargingScreenState extends ConsumerState<ChargingScreen> {
  String? sessionId;
  bool charging = false;
  double energyKwh = 0;
  double amount = 0;
  int elapsedSeconds = 0;
  String tariff = 'Padrao';
  double pricePerKwh = 2.50;

  Future<void> _start() async {
    final api = ref.read(apiServiceProvider);
    try {
      final response = await api.dio.post('/charging/start', data: {
        'chargerId': widget.chargerId,
        'stationId': widget.stationId,
      });
      setState(() {
        sessionId = response.data['id'];
        charging = true;
        if (response.data['tariff'] != null) {
          pricePerKwh = (response.data['tariff']['pricePerKwh'] ?? 2.50).toDouble();
          tariff = response.data['tariff']['name'] ?? 'Padrao';
        }
      });
      _startTimer();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro: $e'), backgroundColor: Colors.red));
      }
    }
  }

  void _startTimer() {
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 5));
      if (!charging || sessionId == null || !mounted) return false;
      elapsedSeconds += 5;
      energyKwh += (pricePerKwh * 0.02);
      amount = energyKwh * pricePerKwh;
      try {
        final api = ref.read(apiServiceProvider);
        await api.dio.patch('/charging/$sessionId/energy', data: {'energyKwh': energyKwh});
      } catch (_) {}
      if (mounted) setState(() {});
      return charging;
    });
  }

  Future<void> _stop() async {
    final api = ref.read(apiServiceProvider);
    try {
      final response = await api.dio.post('/charging/$sessionId/stop', data: {'energyKwh': energyKwh});
      setState(() { charging = false; amount = (response.data['amount'] ?? 0).toDouble(); });
      if (mounted) context.go('/payment?session=$sessionId&amount=${amount.toStringAsFixed(2)}');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro: $e'), backgroundColor: Colors.red));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final minutes = elapsedSeconds ~/ 60;
    final seconds = elapsedSeconds % 60;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: Text(charging ? 'Recarregando...' : 'Iniciar Recarga')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 120, height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: charging ? AppTheme.primary.withAlpha(25) : Colors.grey.withAlpha(25),
                  border: Border.all(color: charging ? AppTheme.primary : Colors.grey, width: 3),
                ),
                child: Icon(Icons.electric_bolt, size: 56, color: charging ? AppTheme.primary : Colors.grey),
              ),
              const SizedBox(height: 32),
              if (charging) ...[
                Text('${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}', style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 8),
                Text('${energyKwh.toStringAsFixed(2)} kWh', style: const TextStyle(fontSize: 24, color: AppTheme.textSecondary)),
                const SizedBox(height: 4),
                Text('R\$ ${amount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 20, color: AppTheme.primary)),
                const SizedBox(height: 8),
                Text('Tarifa: $tariff - R\$ ${pricePerKwh.toStringAsFixed(2)}/kWh', style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity, height: 52,
                  child: ElevatedButton(
                    onPressed: _stop,
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
                    child: const Text('Finalizar Recarga'),
                  ),
                ),
              ] else if (sessionId == null) ...[
                const Text('Pronto para recarregar?', style: TextStyle(fontSize: 20, color: Colors.white)),
                const SizedBox(height: 8),
                Text('Tarifa: $tariff - R\$ ${pricePerKwh.toStringAsFixed(2)}/kWh', style: const TextStyle(color: AppTheme.textSecondary)),
                const SizedBox(height: 32),
                SizedBox(width: double.infinity, height: 52, child: ElevatedButton(onPressed: _start, child: const Text('Iniciar Recarga'))),
              ] else ...[
                const Text('Recarga finalizada!', style: TextStyle(fontSize: 20, color: Colors.white)),
                const SizedBox(height: 8),
                Text('Total: R\$ ${amount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 24, color: AppTheme.primary)),
                const SizedBox(height: 4),
                Text('${energyKwh.toStringAsFixed(2)} kWh', style: const TextStyle(color: AppTheme.textSecondary)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
