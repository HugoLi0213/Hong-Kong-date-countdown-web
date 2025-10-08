# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# Capacitor specific rules
-keep class com.getcapacitor.* { *; }
-keep class org.apache.cordova.* { *; }

# Local Notifications
-keep class com.capacitorjs.plugins.localnotifications.* { *; }

# Vue.js and related
-keep class org.mozilla.javascript.* { *; }
-dontwarn org.mozilla.javascript.**

# Keep all Vue components and their methods
-keep class **.vue.** { *; }

# Keep notification data classes
-keep class com.hongkongholidays.countdown.models.** { *; }

# Optimize for size
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-verbose
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*

# Remove logging
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}
