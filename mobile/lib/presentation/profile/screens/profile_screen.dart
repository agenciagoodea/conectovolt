import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/repositories/auth_repository.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final user = auth.valueOrNull;
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Meu Perfil')),
      body: user == null
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const CircleAvatar(radius: 36, backgroundColor: AppTheme.primary, child: Icon(Icons.person, color: Colors.white, size: 36)),
                  const SizedBox(height: 16),
                  Text(user.name, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(user.email, style: const TextStyle(color: AppTheme.textSecondary)),
                  const SizedBox(height: 32),
                  SizedBox(width: double.infinity, child: ElevatedButton.icon(onPressed: () async { await ref.read(authProvider.notifier).logout(); if (context.mounted) context.go('/login'); }, icon: const Icon(Icons.logout), label: const Text('Sair'))),
                ],
              ),
            ),
    );
  }
}
