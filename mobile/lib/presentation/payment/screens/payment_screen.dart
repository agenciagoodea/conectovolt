import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/services/api_service.dart';
import '../../../core/theme/app_theme.dart';
import 'package:intl/intl.dart';

class PaymentScreen extends ConsumerStatefulWidget {
  final String sessionId;
  final double amount;
  const PaymentScreen({super.key, required this.sessionId, required this.amount});

  @override
  ConsumerState<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends ConsumerState<PaymentScreen> {
  bool _loading = true;
  String? _qrCode;
  String? _copyPaste;
  String? _error;
  bool _copied = false;

  @override
  void initState() {
    super.initState();
    _createPix();
  }

  Future<void> _createPix() async {
    setState(() { _loading = true; _error = null; });
    try {
      final api = ref.read(apiServiceProvider);
      final response = await api.dio.post('/payments', data: {'sessionId': widget.sessionId, 'gateway': 'PIX'});
      setState(() {
        _qrCode = response.data['gateway']['qrCode'];
        _copyPaste = response.data['gateway']['copyPaste'];
      });
    } catch (e) {
      setState(() { _error = 'Erro ao gerar pagamento. Tente novamente.'; });
    } finally {
      setState(() { _loading = false; });
    }
  }

  void _copyToClipboard() {
    if (_copyPaste == null) return;
    Clipboard.setData(ClipboardData(text: _copyPaste!));
    setState(() { _copied = true; });
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) setState(() { _copied = false; });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Pagamento')),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withAlpha(25),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text('PIX', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              ),
              const SizedBox(height: 12),
              Text(
                NumberFormat.currency(symbol: 'R\$', decimalDigits: 2).format(widget.amount),
                style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 28),

              if (_loading)
                const Padding(
                  padding: EdgeInsets.all(40),
                  child: CircularProgressIndicator(),
                ),

              if (_error != null)
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      Text(_error!, style: const TextStyle(color: Colors.redAccent), textAlign: TextAlign.center),
                      const SizedBox(height: 16),
                      ElevatedButton(onPressed: _createPix, child: const Text('Tentar novamente')),
                    ],
                  ),
                ),

              if (_qrCode != null && _qrCode!.isNotEmpty) ...[
                const Text('Escaneie o QR Code', style: TextStyle(color: AppTheme.textSecondary, fontSize: 14)),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(color: AppTheme.primary.withAlpha(40), blurRadius: 20, offset: const Offset(0, 8)),
                    ],
                  ),
                  child: QrImageView(
                    data: _qrCode!,
                    version: QrVersions.auto,
                    size: 200,
                    backgroundColor: Colors.white,
                    gapless: false,
                    errorStateBuilder: (ctx, err) {
                      return Container(
                        width: 200,
                        height: 200,
                        color: Colors.grey.shade200,
                        child: const Center(child: Text('Erro ao gerar QR', style: TextStyle(color: Colors.black54, fontSize: 12))),
                      );
                    },
                  ),
                ),
                if (_copyPaste != null && _copyPaste!.isNotEmpty) ...[
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppTheme.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.primary.withAlpha(40)),
                    ),
                    child: Text(
                      _copyPaste!,
                      style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11, fontFamily: 'monospace'),
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: _copyToClipboard,
                      icon: Icon(_copied ? Icons.check : Icons.copy, size: 18),
                      label: Text(_copied ? 'Codigo copiado!' : 'Copiar codigo PIX'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: _copied ? AppTheme.primary : AppTheme.primary,
                        side: BorderSide(color: _copied ? AppTheme.primary : AppTheme.primary),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ],

              const SizedBox(height: 24),
              TextButton(
                onPressed: () => context.go('/history'),
                child: const Text('Ver historico de recargas', style: TextStyle(color: AppTheme.textSecondary)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
