package org.moon.algotn.theme;

import android.content.res.Resources;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = Material3ThemeModule.NAME)
public class Material3ThemeModule extends ReactContextBaseJavaModule {
    public static final String NAME = "Material3Theme";

    public Material3ThemeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void getSystemTheme(Promise promise) {
        try {
            WritableMap result = getDynamicColorPalette();
            if (result == null) {
                Log.w(NAME, "getDynamicColorPalette returned null");
                promise.reject("ERROR", "Could not get color palette");
                return;
            }
            if (!result.hasKey("light") || !result.hasKey("dark")) {
                promise.reject("ERROR", "Invalid palette structure");
                return;
            }
            Log.d(NAME, "Color palette: " + result);
            promise.resolve(result);
        } catch (Exception e) {
            Log.e(NAME, "Error getting system theme", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getSystemThemeAsync(Promise promise) {
        getSystemTheme(promise);
    }

    private @Nullable WritableMap getDynamicColorPalette() {
        Log.d(NAME, "Get dynamic color palette");

        int currentSdk = Build.VERSION.SDK_INT;
        int minSdk = Build.VERSION_CODES.S;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            Resources resources = getReactApplicationContext().getResources();
            if (resources == null) {
                Log.w(NAME, "Could not get resources for dynamic color module");
                return null;
            }
            return getCorePalette(resources);
        } else {
            Log.w(NAME, "SDK version " + minSdk + " is required to run this native module, got " + currentSdk);
            return null;
        }
    }

    @RequiresApi(Build.VERSION_CODES.S)
    private WritableMap getCorePalette(Resources resources) {
        WritableMap palette = new WritableNativeMap();
        WritableMap lightPalette = new WritableNativeMap();
        WritableMap darkPalette = new WritableNativeMap();

        // Light theme colors
        lightPalette.putString("primary", colorToHex(resources, android.R.color.system_accent1_600));
        lightPalette.putString("onPrimary", colorToHex(resources, android.R.color.system_accent1_0));
        lightPalette.putString("primaryContainer", colorToHex(resources, android.R.color.system_accent1_100));
        lightPalette.putString("onPrimaryContainer", colorToHex(resources, android.R.color.system_accent1_900));

        lightPalette.putString("secondary", colorToHex(resources, android.R.color.system_accent2_600));
        lightPalette.putString("onSecondary", colorToHex(resources, android.R.color.system_accent2_0));
        lightPalette.putString("secondaryContainer", colorToHex(resources, android.R.color.system_accent2_100));
        lightPalette.putString("onSecondaryContainer", colorToHex(resources, android.R.color.system_accent2_900));

        lightPalette.putString("tertiary", colorToHex(resources, android.R.color.system_accent3_600));
        lightPalette.putString("onTertiary", colorToHex(resources, android.R.color.system_accent3_0));
        lightPalette.putString("tertiaryContainer", colorToHex(resources, android.R.color.system_accent3_100));
        lightPalette.putString("onTertiaryContainer", colorToHex(resources, android.R.color.system_accent3_900));

        lightPalette.putString("background", colorToHex(resources, android.R.color.system_neutral1_10));
        lightPalette.putString("onBackground", colorToHex(resources, android.R.color.system_neutral1_900));

        lightPalette.putString("surface", colorToHex(resources, android.R.color.system_neutral1_10));
        lightPalette.putString("onSurface", colorToHex(resources, android.R.color.system_neutral1_900));
        lightPalette.putString("surfaceVariant", colorToHex(resources, android.R.color.system_neutral2_100));
        lightPalette.putString("onSurfaceVariant", colorToHex(resources, android.R.color.system_neutral2_700));

        lightPalette.putString("outline", colorToHex(resources, android.R.color.system_neutral2_500));
        lightPalette.putString("outlineVariant", colorToHex(resources, android.R.color.system_neutral2_200));

        lightPalette.putString("inverseSurface", colorToHex(resources, android.R.color.system_neutral1_800));
        lightPalette.putString("inverseOnSurface", colorToHex(resources, android.R.color.system_neutral1_50));
        lightPalette.putString("inversePrimary", colorToHex(resources, android.R.color.system_accent1_200));

        // Dark theme colors
        darkPalette.putString("primary", colorToHex(resources, android.R.color.system_accent1_200));
        darkPalette.putString("onPrimary", colorToHex(resources, android.R.color.system_accent1_800));
        darkPalette.putString("primaryContainer", colorToHex(resources, android.R.color.system_accent1_700));
        darkPalette.putString("onPrimaryContainer", colorToHex(resources, android.R.color.system_accent1_100));

        darkPalette.putString("secondary", colorToHex(resources, android.R.color.system_accent2_200));
        darkPalette.putString("onSecondary", colorToHex(resources, android.R.color.system_accent2_800));
        darkPalette.putString("secondaryContainer", colorToHex(resources, android.R.color.system_accent2_700));
        darkPalette.putString("onSecondaryContainer", colorToHex(resources, android.R.color.system_accent2_100));

        darkPalette.putString("tertiary", colorToHex(resources, android.R.color.system_accent3_200));
        darkPalette.putString("onTertiary", colorToHex(resources, android.R.color.system_accent3_800));
        darkPalette.putString("tertiaryContainer", colorToHex(resources, android.R.color.system_accent3_700));
        darkPalette.putString("onTertiaryContainer", colorToHex(resources, android.R.color.system_accent3_100));

        darkPalette.putString("background", colorToHex(resources, android.R.color.system_neutral1_900));
        darkPalette.putString("onBackground", colorToHex(resources, android.R.color.system_neutral1_100));

        darkPalette.putString("surface", colorToHex(resources, android.R.color.system_neutral1_900));
        darkPalette.putString("onSurface", colorToHex(resources, android.R.color.system_neutral1_100));
        darkPalette.putString("surfaceVariant", colorToHex(resources, android.R.color.system_neutral2_700));
        darkPalette.putString("onSurfaceVariant", colorToHex(resources, android.R.color.system_neutral2_200));

        darkPalette.putString("outline", colorToHex(resources, android.R.color.system_neutral2_400));
        darkPalette.putString("outlineVariant", colorToHex(resources, android.R.color.system_neutral2_700));

        darkPalette.putString("inverseSurface", colorToHex(resources, android.R.color.system_neutral1_100));
        darkPalette.putString("inverseOnSurface", colorToHex(resources, android.R.color.system_neutral1_800));
        darkPalette.putString("inversePrimary", colorToHex(resources, android.R.color.system_accent1_600));

        palette.putMap("light", lightPalette);
        palette.putMap("dark", darkPalette);

        return palette;
    }

    private String colorToHex(Resources resources, int colorId) {
        try {
            int color = resources.getColor(colorId, null);
            return String.format("#%06X", 0xFFFFFF & color);
        } catch (Resources.NotFoundException e) {
            Log.e(NAME, "Color resource not found: " + colorId);
            return "#000000";
        }
    }
}
