import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/services/api_service.dart';
import '../../../core/theme/app_theme.dart';

class StationDetailScreen extends ConsumerWidget {
  final String stationId;
  const StationDetailScreen({super.key, required this.stationId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final api = ref.read(apiServiceProvider);
    final stationFuture = api.dio.get('/stations/$stationId');

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Detalhes do Posto')),
      body: FutureBuilder(
        future: stationFuture,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
          final station = snapshot.data!.data;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(station['name'], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 8),
                Row(children: [
                  const Icon(Icons.location_on, color: AppTheme.primary, size: 18),
                  const SizedBox(width: 6),
                  Expanded(child: Text('${station['address']}, ${station['city']}/${station['state']}', style: const TextStyle(color: AppTheme.textSecondary))),
                ]),
                const SizedBox(height: 24),
                const Text('Carregadores Disponiveis', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white)),
                const SizedBox(height: 12),
                ...((station['chargers'] as List?) ?? []).map((charger) => Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Row(
                      children: [
                        Container(
                          width: 44, height: 44,
                          decoration: BoxDecoration(
                            color: charger['status'] == 'ONLINE' ? Colors.green.withAlpha(25) : Colors.grey.withAlpha(25),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(Icons.bolt, color: charger['status'] == 'ONLINE' ? Colors.green : Colors.grey, size: 24),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${charger['manufacturer'] ?? 'Carregador'} - ${charger['model'] ?? ''}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
                              Text('${charger['powerKw']} kW', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: charger['status'] == 'ONLINE' ? Colors.green.withAlpha(25) : Colors.grey.withAlpha(25),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(charger['status'] == 'ONLINE' ? 'Online' : 'Offline', style: TextStyle(color: charger['status'] == 'ONLINE' ? Colors.green : Colors.grey, fontSize: 12)),
                        ),
                        const SizedBox(width: 8),
                        if (charger['status'] == 'ONLINE')
                          ElevatedButton(
                            onPressed: () => context.go('/charging/start?charger=${charger['id']}&station=$stationId'),
                            style: ElevatedButton.styleFrom(minimumSize: const Size(80, 36), padding: const EdgeInsets.symmetric(horizontal: 12)),
                            child: const Text('Iniciar', style: TextStyle(fontSize: 13)),
                          ),
                      ],
                    ),
                  ),
                )),
              ],
            ),
          );
        },
      ),
    );
  }
}
