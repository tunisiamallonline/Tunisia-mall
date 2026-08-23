import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://sxajasczwurlchyluf.supabase.co',
    anonKey: 'Sb_publishable_FbKKHDuGIz_21743WXFYbg_BVhd6jvk',
  );

  runApp(const MyApp());
}

final supabase = Supabase.instance.client;
