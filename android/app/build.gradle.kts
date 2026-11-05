plugins { id("com.android.application") }

val ksFile = System.getenv("ANDROID_KEYSTORE_FILE")
val hasKey = !ksFile.isNullOrBlank() && file(ksFile).exists()

android {
    namespace = "com.feynos.pawsway"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.feynos.pawsway"
        minSdk = 26
        targetSdk = 35
        versionCode = (System.getenv("VERSION_CODE") ?: "1").toInt()
        versionName = System.getenv("VERSION_NAME") ?: "1.0.0"
    }
    signingConfigs {
        if (hasKey) {
            create("release") {
                storeFile = file(ksFile!!)
                storePassword = System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("ANDROID_KEY_ALIAS")
                keyPassword = System.getenv("ANDROID_KEY_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = if (hasKey) signingConfigs.getByName("release") else signingConfigs.getByName("debug")
        }
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}
