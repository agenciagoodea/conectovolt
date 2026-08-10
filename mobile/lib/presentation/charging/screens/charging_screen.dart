import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/repositories/auth_repository.dart';

class ChargingScreen extends ConsumerStatefulWidget {
  final String chargerId;
  final String stationId;
  final String? connectorId;
  const ChargingScreen({super.key, required this.chargerId, required this.stationId, this.connectorId});

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
  String? vehicleId;
  List<Map<String, dynamic>> vehicles = [];
  Timer? _pollTimer;
  bool loading = false;

  @override
  void initState() {
    super.initState();
    _loadVehicles();
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadVehicles() async {
    try {
      final api = ref.read(apiServiceProvider);
      final response = await api.dio.get('/vehicles');
      if (mounted) {
        setState(() {
          vehicles = (response.data as List).cast<Map<String, dynamic>>();
        });
      }
    } catch (_) {
      // Vehicle selection remains optional for chargers that identify drivers.
    }
  }

  Future<void> _start() async {
    final api = ref.read(apiServiceProvider);
    setState(() => loading = true);
    try {
      final response = await api.dio.post('/charging/start', data: {
        'chargerId': widget.chargerId,
        'stationId': widget.stationId,
        if (widget.connectorId != null) 'connectorId': widget.connectorId,
        if (vehicleId != null) 'vehicleId': vehicleId,
      });
      setState(() {
        sessionId = response.data['id'] ?? response.data['sessionId'];
        charging = true;
        if (response.data['tariff'] != null) {
          pricePerKwh = (response.data['tariff']['pricePerKwh'] ?? 2.50).toDouble();
          tariff = response.data['tariff']['name'] ?? 'Padrao';
        }
      });
      _pollTimer = Timer.periodic(const Duration(seconds: 5), (_) => _refreshSession());
      await _refreshSession();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro: $e'), backgroundColor: Colors.red));
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _refreshSession() async {
    if (!charging || sessionId == null) return;
    try {
      final api = ref.read(apiServiceProvider);
      final response = await api.dio.get('/charging/active');
      final data = response.data as Map<String, dynamic>?;
      if (data == null || !mounted) return;
      setState(() {
        energyKwh = (data['energyKwh'] ?? energyKwh).toDouble();
        amount = (data['currentAmount'] ?? data['amount'] ?? amount).toDouble();
        elapsedSeconds = ((data['durationMinutes'] ?? 0) as num).toInt() * 60;
        final activeTariff = data['tariff'];
        if (activeTariff is Map<String, dynamic>) {
          pricePerKwh = (activeTariff['pricePerKwh'] ?? pricePerKwh).toDouble();
          tariff = activeTariff['name'] ?? tariff;
        }
      });
    } catch (_) {
      // Keep the last confirmed telemetry on transient network failures.
    }
  }

  Future<void> _stop() async {
    final api = ref.read(apiServiceProvider);
    if (sessionId == null || energyKwh <= 0) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Aguardando a telemetria de energia para finalizar.')),
        );
      }
      return;
    }
    setState(() => loading = true);
    try {
      final response = await api.dio.post('/charging/$sessionId/stop', data: {'energyKwh': energyKwh});
      setState(() { charging = false; amount = (response.data['amount'] ?? 0).toDouble(); });
      if (mounted) context.go('/payment?session=$sessionId&amount=${amount.toStringAsFixed(2)}');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro: $e'), backgroundColor: Colors.red));
      }
    } finally {
      if (mounted) setState(() => loading = false);
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
                    onPressed: loading ? null : _stop,
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
                    child: const Text('Finalizar Recarga'),
                  ),
                ),
              ] else if (sessionId == null) ...[
                const Text('Pronto para recarregar?', style: TextStyle(fontSize: 20, color: Colors.white)),
                const SizedBox(height: 8),
                Text('Tarifa: $tariff - R\$ ${pricePerKwh.toStringAsFixed(2)}/kWh', style: const TextStyle(color: AppTheme.textSecondary)),
                if (vehicles.isNotEmpty) ...[
                  const SizedBox(height: 20),
                  DropdownButtonFormField<String>(
                    initialValue: vehicleId,
                    decoration: const InputDecoration(labelText: 'Veiculo (opcional)'),
                    items: vehicles.map((vehicle) => DropdownMenuItem<String>(value: vehicle['id'] as String, child: Text('${vehicle['brand']} ${vehicle['model']}'))).toList(),
                    onChanged: (value) => setState(() => vehicleId = value),
                  ),
                ],
                const SizedBox(height: 32),
                SizedBox(width: double.infinity, height: 52, child: ElevatedButton(onPressed: loading ? null : _start, child: loading ? const CircularProgressIndicator() : const Text('Iniciar Recarga'))),
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
