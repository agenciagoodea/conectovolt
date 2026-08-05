import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/services/api_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/models/models.dart';

final historyProvider = FutureProvider<List<ChargingSessionModel>>((ref) async {
  final api = ref.read(apiServiceProvider);
  final response = await api.dio.get('/charging/history', queryParameters: {'limit': 50});
  final data = response.data['data'] ?? response.data;
  return (data as List).map((j) => ChargingSessionModel.fromJson(j)).toList();
});

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final history = ref.watch(historyProvider);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Historico de Recargas')),
      body: history.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Erro: $e', style: const TextStyle(color: Colors.redAccent))),
        data: (sessions) => sessions.isEmpty
          ? const Center(child: Text('Nenhuma recarga encontrada', style: TextStyle(color: AppTheme.textSecondary)))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: sessions.length,
              itemBuilder: (_, i) => _SessionCard(session: sessions[i]),
            ),
      ),
    );
  }
}

class _SessionCard extends StatelessWidget {
  final ChargingSessionModel session;
  const _SessionCard({required this.session});

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm');
    final statusColors = {'COMPLETED': Colors.green, 'CANCELLED': Colors.redAccent, 'ACTIVE': AppTheme.primary, 'PENDING': Colors.orange};

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(child: Text(session.stationName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600))),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: (statusColors[session.status] ?? Colors.grey).withAlpha(25),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(session.status, style: TextStyle(color: statusColors[session.status] ?? Colors.grey, fontSize: 11)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.bolt, size: 16, color: AppTheme.primary),
                const SizedBox(width: 4),
                Text('${session.energyKwh.toStringAsFixed(1)} kWh', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14)),
                const SizedBox(width: 16),
                const Icon(Icons.timer, size: 16, color: AppTheme.primary),
                const SizedBox(width: 4),
                Text('${session.durationMinutes} min', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14)),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(dateFormat.format(session.startTime), style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                Text('R\$ ${session.amount.toStringAsFixed(2)}', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w600, fontSize: 16)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
