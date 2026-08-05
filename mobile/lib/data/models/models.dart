class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? companyId;

  UserModel({required this.id, required this.name, required this.email, required this.role, this.companyId});

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'],
    name: json['name'],
    email: json['email'],
    role: json['role'],
    companyId: json['companyId'],
  );
}

class StationModel {
  final String id;
  final String name;
  final String address;
  final String city;
  final String state;
  final double latitude;
  final double longitude;
  final String status;
  final int chargersCount;

  StationModel({
    required this.id, required this.name, required this.address,
    required this.city, required this.state, required this.latitude,
    required this.longitude, required this.status, required this.chargersCount,
  });

  factory StationModel.fromJson(Map<String, dynamic> json) => StationModel(
    id: json['id'], name: json['name'], address: json['address'],
    city: json['city'], state: json['state'],
    latitude: (json['latitude'] ?? 0).toDouble(),
    longitude: (json['longitude'] ?? 0).toDouble(),
    status: json['status'],
    chargersCount: json['chargers']?.length ?? 0,
  );
}

class ChargingSessionModel {
  final String id;
  final String stationName;
  final double energyKwh;
  final double amount;
  final String status;
  final DateTime startTime;
  final DateTime? endTime;
  final int durationMinutes;

  ChargingSessionModel({
    required this.id, required this.stationName, required this.energyKwh,
    required this.amount, required this.status, required this.startTime,
    this.endTime, required this.durationMinutes,
  });

  factory ChargingSessionModel.fromJson(Map<String, dynamic> json) => ChargingSessionModel(
    id: json['id'],
    stationName: json['station']?['name'] ?? 'Desconhecido',
    energyKwh: (json['energyKwh'] ?? 0).toDouble(),
    amount: (json['amount'] ?? 0).toDouble(),
    status: json['status'],
    startTime: DateTime.parse(json['startTime']),
    endTime: json['endTime'] != null ? DateTime.parse(json['endTime']) : null,
    durationMinutes: json['durationMinutes'] ?? 0,
  );
}
