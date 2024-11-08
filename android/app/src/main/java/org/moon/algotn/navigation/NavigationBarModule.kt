package org.moon.algotn.navigation

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.view.View
import android.view.WindowInsetsController
import android.view.WindowManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.IllegalViewOperationException

class NavigationBarModule(context: ReactApplicationContext?) : ReactContextBaseJavaModule(context) {

    init {
        reactContext = context
    }

    private fun setNavigationBarTheme(activity: Activity?, light: Boolean) {
        activity?.let {
            val window = it.window

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
                val flags = window.decorView.systemUiVisibility
                window.decorView.systemUiVisibility = if (light) {
                    flags or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
                } else {
                    flags and View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR.inv()
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                val insetsController = window.insetsController
                insetsController?.let { controller ->
                    val flag = if (light) {
                        WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
                    } else {
                        0
                    }
                    controller.setSystemBarsAppearance(
                        flag,
                        WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
                    )
                }
            }
        }
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun getConstants(): Map<String, Any> {
        return mapOf("EXAMPLE_CONSTANT" to "example")
    }

    @ReactMethod
    fun changeNavigationBarColor(
        color: String,
        light: Boolean,
        animated: Boolean,
        promise: Promise
    ) {
        currentActivity?.let { activity ->
            UiThreadUtil.runOnUiThread {
                try {
                    val window = activity.window

                    when (color) {
                        "transparent" -> {
                            window.setFlags(
                                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
                            )
                        }

                        "translucent" -> {
                            window.setFlags(
                                WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION,
                                WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
                            )
                        }

                        else -> {
                            window.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
                            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
                            val colorTo = Color.parseColor(color)

                            if (animated) {
                                val colorFrom = window.navigationBarColor
                                ValueAnimator.ofObject(ArgbEvaluator(), colorFrom, colorTo).apply {
                                    addUpdateListener { animator ->
                                        window.navigationBarColor = (animator.animatedValue as Int)
                                    }
                                    start()
                                }
                            } else {
                                window.navigationBarColor = colorTo
                            }
                        }
                    }

                    setNavigationBarTheme(activity, light)
                    promise.resolve(Arguments.createMap().apply { putBoolean("success", true) })
                } catch (e: IllegalViewOperationException) {
                    promise.reject("error", e)
                }
            }
        } ?: promise.reject(ERROR_NO_ACTIVITY, Throwable(ERROR_NO_ACTIVITY_MESSAGE))
    }

    private fun setNavBarVisibility(activity: Activity, visible: Boolean) {
        val window = activity.window
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val insetsController = window.insetsController
            if (visible) {
                insetsController?.show(WindowInsetsController.BEHAVIOR_SHOW_BARS_BY_TOUCH)
            } else {
                insetsController?.hide(WindowInsetsController.BEHAVIOR_SHOW_BARS_BY_TOUCH)
            }
        } else {
            val decorView = window.decorView
            decorView.systemUiVisibility = if (visible) {
                View.SYSTEM_UI_FLAG_VISIBLE
            } else {
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            }
        }
    }

    @ReactMethod
    fun hideNavigationBar(promise: Promise) {
        currentActivity?.let { activity ->
            UiThreadUtil.runOnUiThread {
                try {
                    setNavBarVisibility(activity, visible = false)
                    promise.resolve(Arguments.createMap().apply { putBoolean("success", true) })
                } catch (e: IllegalViewOperationException) {
                    promise.reject("error", e)
                }
            }
        } ?: promise.reject(ERROR_NO_ACTIVITY, Throwable(ERROR_NO_ACTIVITY_MESSAGE))
    }

    @ReactMethod
    fun showNavigationBar(promise: Promise) {
        currentActivity?.let { activity ->
            UiThreadUtil.runOnUiThread {
                try {
                    setNavBarVisibility(activity, visible = true)
                    promise.resolve(Arguments.createMap().apply { putBoolean("success", true) })
                } catch (e: IllegalViewOperationException) {
                    promise.reject("error", e)
                }
            }
        } ?: promise.reject(ERROR_NO_ACTIVITY, Throwable(ERROR_NO_ACTIVITY_MESSAGE))
    }

    companion object {
        const val REACT_CLASS = "NavigationBar"
        private const val ERROR_NO_ACTIVITY = "E_NO_ACTIVITY"
        private const val ERROR_NO_ACTIVITY_MESSAGE =
            "Tried to change the navigation bar while not attached to an Activity"
        private var reactContext: ReactApplicationContext? = null
    }
}