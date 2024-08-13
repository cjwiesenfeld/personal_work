import 'dart:io';

import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
  }
}

void main() {
  HttpOverrides.global = MyHttpOverrides();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Namer App',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blueAccent),
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  
IconData coffeeIcon = Icons.coffee;
IconData starIcon = Icons.star;

 

  

  
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
      var appState = context.watch<MyAppState>();
      return Scaffold(
        body: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
             ElevatedButton.icon(
                  onPressed: () {
                     _navigateToSearchScreen(context);
                  },
                  icon: Icon(appState.coffeeIcon),//coffee
                  label: Text('Search'),
                ),
                SizedBox(width: 10),
                ElevatedButton.icon(
                  onPressed: () {
                    _navigateToNextScreen(context);
                  },
                  icon: Icon(appState.starIcon),//star
                  label: Text('Rate'),
                ),
            ],
          ),
        ),
      );
    
  }
  void _navigateToNextScreen(BuildContext context) {
    Navigator.of(context).push(MaterialPageRoute(builder: (context) => RateScreen()));
  }
  void _navigateToSearchScreen(BuildContext context) {
    Navigator.of(context).push(MaterialPageRoute(builder: (context) => SearchScreen()));
  }
}

class RateScreen extends StatelessWidget {
  const RateScreen({super.key});

  @override
  Widget build(BuildContext context) {
    void _navigateToHomeScreen(BuildContext context) {
    Navigator.of(context).push(MaterialPageRoute(builder: (context) => MyHomePage()));
  }
  TextEditingController shopNameController = TextEditingController();
  double rating = 5.0;
  Future<void> submitRating(String shopName, double rating) async {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/rate'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, dynamic>{
          'shopName': shopName,
          'rating': rating,
        }),
      );
      if (response.statusCode == 200) {
        print('Rating submitted successfully');
      } else {
        print('Failed to submit rating');
      }
  }
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rate a coffee place'),
        ),
      body: Column(
        children: [
          
          TextField(
              controller: shopNameController,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Shop Name',
              ),
            ),
          const SizedBox(height: 20),
            const Text(
              'Rate the coffee:',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 10),
            RatingBar.builder(
              initialRating: 3,
              minRating: 1,
              direction: Axis.horizontal,
              allowHalfRating: true,
              itemCount: 5,
              itemPadding: const EdgeInsets.symmetric(horizontal: 4.0),
              itemBuilder: (context, _) => const Icon(
                Icons.star,
                color: Colors.amber,
              ),
              onRatingUpdate: (rating) {
                rating = rating;
              },
            ),
            ElevatedButton(
                  onPressed: () {
                    submitRating(shopNameController.text, rating);
                  },
                  child: Text('Submit'),
                ),
          // Here I want a the user to be able to rate the coffee out of 5 start. 
        ],
      )
    );
  }
}

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    
  
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search for a coffee place'),
        ),
      body: Center(
        child: Column(
          children: [
            
            TextField(
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Enter shop name',
              ),
            ),
            ElevatedButton(
                  onPressed: () {
                    print("GET BACKEND dATA");
                  },
                  child: Text('Search'),
                ),
          ],
        ),
      )
    );
  }
}
