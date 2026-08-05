import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/repositories/auth_repository.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _name = TextEditingController();
  bool _isRegister = false;
  bool _loading = false;
  String? _error;

  Future<void> _submit() async {
    setState(() { _loading = true; _error = null; });
    try {
      if (_isRegister) {
        await ref.read(authProvider.notifier).register(_name.text, _email.text, _password.text);
      } else {
        await ref.read(authProvider.notifier).login(_email.text, _password.text);
      }
      if (mounted) context.go('/map');
    } catch (e) {
      setState(() { _error = 'Email ou senha invalidos'; });
    } finally {
      setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 72, height: 72,
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withAlpha(30),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.electric_bolt, color: AppTheme.primary, size: 36),
                ),
                const SizedBox(height: 20),
                const Text('ConectoVolt', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 4),
                Text(_isRegister ? 'Crie sua conta' : 'Encontre postos proximos', style: const TextStyle(color: AppTheme.textSecondary)),
                const SizedBox(height: 32),
                if (_error != null) ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: Colors.red.withAlpha(25), borderRadius: BorderRadius.circular(8)),
                    child: Text(_error!, style: const TextStyle(color: Colors.redAccent)),
                  ),
                  const SizedBox(height: 16),
                ],
                if (_isRegister)
                  TextField(controller: _name, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Nome completo'),
                ),
                if (_isRegister) const SizedBox(height: 12),
                TextField(controller: _email, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Email'), keyboardType: TextInputType.emailAddress),
                const SizedBox(height: 12),
                TextField(controller: _password, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Senha'), obscureText: true),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity, height: 52,
                  child: ElevatedButton(
                    onPressed: _loading ? null : _submit,
                    child: _loading ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : Text(_isRegister ? 'Criar conta' : 'Entrar'),
                  ),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => setState(() { _isRegister = !_isRegister; _error = null; }),
                  child: Text(_isRegister ? 'Ja tem conta? Entrar' : 'Nao tem conta? Cadastrar', style: const TextStyle(color: AppTheme.primary)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
