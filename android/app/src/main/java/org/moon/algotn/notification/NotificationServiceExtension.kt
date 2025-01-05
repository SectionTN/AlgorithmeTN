/*
 * This is the source code of Moon Organization.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright to Moon, By Rayen Sbai, 2021-2025.
 */

package org.moon.algotn.notification

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import androidx.annotation.Keep
import androidx.core.app.NotificationCompat
import com.onesignal.notifications.INotificationReceivedEvent
import com.onesignal.notifications.INotificationServiceExtension
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

@Keep
class NotificationServiceExtension : INotificationServiceExtension {

    private fun getBitmapFromURL(src: String): Bitmap? {
        return try {
            val url = URL(src)
            val connection = url.openConnection() as HttpURLConnection
            connection.doInput = true
            connection.connect()
            val input = connection.inputStream
            BitmapFactory.decodeStream(input)
        } catch (e: IOException) {
            Log.e(TAG, "Error loading bitmap", e)
            null
        }
    }

    override fun onNotificationReceived(event: INotificationReceivedEvent) {
        try {
            val notification = event.notification
            val additionalData = notification.additionalData

            notification.setExtender { builder: NotificationCompat.Builder ->
                builder.apply {
                    setChannelId("posts_interactions")
                    setContentTitle(notification.title)
                    setContentText(notification.body)
                    setPriority(NotificationCompat.PRIORITY_HIGH)
                    setAutoCancel(true)
                    setWhen(notification.sentTime * 1000)

                    additionalData?.optString("senderPhoto")?.let { photoUrl ->
                        if (photoUrl.length > 2) {
                            getBitmapFromURL(photoUrl)?.let { bitmap -> setLargeIcon(bitmap) }
                        }
                    }
                }
            }

            notification.display()
        } catch (e: Exception) {
            Log.e(TAG, "Error processing notification", e)
            event.notification.display()
        }
    }

    companion object {
        private const val TAG = "NotificationServiceExtension"
    }
}
