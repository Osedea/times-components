package uk.co.news.rntbrightcovevideo;

import java.util.ArrayList;

import android.content.Context;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.SurfaceView;
import android.view.View;

import com.brightcove.ima.GoogleIMAComponent;
import com.brightcove.ima.GoogleIMAEventType;

import com.brightcove.player.edge.Catalog;
import com.brightcove.player.edge.VideoListener;
import com.brightcove.player.event.Event;
import com.brightcove.player.event.EventEmitter;
import com.brightcove.player.event.EventListener;
import com.brightcove.player.event.EventType;
import com.brightcove.player.mediacontroller.BrightcoveMediaController;
import com.brightcove.player.model.Video;
import com.brightcove.player.view.BrightcoveExoPlayerVideoView;

import com.google.ads.interactivemedia.v3.api.AdDisplayContainer;
import com.google.ads.interactivemedia.v3.api.AdsManager;
import com.google.ads.interactivemedia.v3.api.AdsRequest;
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory;

public class BrightcovePlayerView extends BrightcoveExoPlayerVideoView {

    public static final String TAG = BrightcovePlayerView.class.getSimpleName();

    private Boolean mAutoplay;
    private Boolean mIsPlaying = false;
    private Boolean mIsFullscreen = false;
    private GoogleIMAComponent googleIMAComponent;
    private float mProgress = 0;

    public BrightcovePlayerView(final Context context) {
        super(context);
        this.setBackgroundColor(Color.BLACK);
        finishInitialization();
        this.setMediaController(new BrightcoveMediaController(this));
    }

    private EventEmitter setupEventEmitter() {
        final BrightcovePlayerView playerView = BrightcovePlayerView.this;

        EventEmitter eventEmitter = this.getEventEmitter();
        eventEmitter.on(EventType.VIDEO_SIZE_KNOWN, new EventListener() {
            @Override
            public void processEvent(Event e) {
               fixVideoLayout();
            }
        });
        eventEmitter.on(EventType.PLAY, onEvent(true));
        eventEmitter.on(EventType.PAUSE, onEvent(false));
        eventEmitter.on(EventType.PROGRESS, onEvent(true));
        eventEmitter.on(EventType.COMPLETED, new EventListener() {
            @Override
            public void processEvent(Event e) {
                playerView.bubbleState(false, playerView.getDuration());
            }
        });
        eventEmitter.on(EventType.SEEK_TO, new EventListener() {
            @Override
            public void processEvent(Event e) {
                playerView.bubbleCurrentState();
            }
        });
        eventEmitter.on(EventType.ENTER_FULL_SCREEN, new EventListener() {
            @Override
            public void processEvent(Event e) {
                mIsFullscreen = true;
                playerView.bubbleCurrentState();
                playerView.getEventEmitter().emit(EventType.CONFIGURATION_CHANGED);
            }
        });
        eventEmitter.on(EventType.EXIT_FULL_SCREEN, new EventListener() {
            @Override
            public void processEvent(Event e) {
                mIsFullscreen = false;
                playerView.bubbleCurrentState();
                playerView.getEventEmitter().emit(EventType.CONFIGURATION_CHANGED);
            }
        });
        eventEmitter.on(EventType.ERROR, new EventListener() {
            @Override
            public void processEvent(Event e) {
                ((RNTBrightcoveView) playerView.getParent()).emitError(e);
            }
        });
        return eventEmitter;
    }

    private void bubbleCurrentState() {
        bubbleState(getIsPlaying(), (int) getPlayheadPosition());
    }

    private void bubbleState(Boolean isPlaying, int headPos) {
        mIsPlaying = isPlaying;

        try {
            RNTBrightcoveView parentView = (RNTBrightcoveView) this.getParent();
            parentView.emitState(mIsPlaying, headPos);
        } catch (ClassCastException exc) {
            // ignore
        }
    }

    public void initVideo(String videoId, String accountId, String policyKey, Boolean autoplay, Boolean isFullscreenButtonHidden, String vastTag) {
            View fullScreenButton = this.findViewById(com.brightcove.player.R.id.full_screen);
            fullScreenButton.setVisibility(isFullscreenButtonHidden ? View.GONE : View.VISIBLE);

            mAutoplay = autoplay;
            Log.i(TAG, "INIT");

            EventEmitter eventEmitter = setupEventEmitter();
            // setupGoogleIMA(vastTag, eventEmitter);

            Catalog catalog = new Catalog(eventEmitter, accountId, policyKey);
            catalog.findVideoByID(videoId, createVideoListener());
    }

    private EventListener onEvent(final Boolean isPlaying) {
        final BrightcovePlayerView playerView = BrightcovePlayerView.this;

        return new EventListener() {
            @Override
            public void processEvent(Event event) {
                playerView.bubbleState(isPlaying, (int) playerView.getPlayheadPosition());
            }
        };
    }

    @NonNull
    private VideoListener createVideoListener() {
        return new VideoListener() {
            @Override
            public void onVideo(final Video video) {
                BrightcovePlayerView.this.add(video);

                BrightcovePlayerView.this.seekTo((int) mProgress);

                BrightcovePlayerView.this.invalidate();
                BrightcovePlayerView.this.requestLayout();

                if (mAutoplay) {
                    BrightcovePlayerView.this.start();
                }
            }
        };
    }

    private void fixVideoLayout() {
        Log.d(TAG, "fixVideoLayout");

        final int viewW = this.getMeasuredWidth();
        final int viewH = this.getMeasuredHeight();

        SurfaceView surfaceView = (SurfaceView) this.getRenderView();

        surfaceView.measure(viewW, viewH);

        final int surfaceW = surfaceView.getMeasuredWidth();
        final int surfaceH = surfaceView.getMeasuredHeight();

        final int leftOffset = (viewW - surfaceW) / 2;
        final int topOffset = (viewH - surfaceH) / 2;

        surfaceView.layout(
                leftOffset,
                topOffset,
                leftOffset + surfaceW,
                topOffset + surfaceH
        );
    }

    public Boolean getIsPlaying() {
        return mIsPlaying;
    }
    public Boolean getIsFullscreen() {
        return mIsFullscreen;
    }

    public float getPlayheadPosition() {
        return playheadPosition;
    }

    /**
     * Setup the Brightcove IMA Plugin.
     */
    private void setupGoogleIMA(final String adRulesURL, final EventEmitter eventEmitter) {
        Log.i(TAG, "SETUP");

        // Establish the Google IMA SDK factory instance.
        final ImaSdkFactory sdkFactory = ImaSdkFactory.getInstance();

        // Enable logging up ad start.
        eventEmitter.on(EventType.AD_STARTED, new EventListener() {
            @Override
            public void processEvent(Event event) {
                Log.v(TAG, event.getType());
                Log.i(TAG, "STARTED");
            }
        });

        // Enable logging any failed attempts to play an ad.
        eventEmitter.on(GoogleIMAEventType.DID_FAIL_TO_PLAY_AD, new EventListener() {
            @Override
            public void processEvent(Event event) {
                Log.i(TAG, "FAILED");
                Log.v(TAG, event.getType());
            }
        });

        // Enable Logging upon ad completion.
        eventEmitter.on(EventType.AD_COMPLETED, new EventListener() {
            @Override
            public void processEvent(Event event) {
                Log.v(TAG, event.getType());
                Log.i(TAG, "COMPLETED");
            }
        });

        final BrightcoveExoPlayerVideoView playerView = this;

        // Set up a listener for initializing AdsRequests. The Google
        // IMA plugin emits an ad request event as a result of
        // initializeAdsRequests() being called.
        eventEmitter.on(GoogleIMAEventType.ADS_REQUEST_FOR_VIDEO, new EventListener() {
            @Override
            public void processEvent(Event event) {
                Log.i(TAG, "VIDEO REQUEST");
                // Create a container object for the ads to be presented.
                AdDisplayContainer container = sdkFactory.createAdDisplayContainer();
                container.setPlayer(googleIMAComponent.getVideoAdPlayer());
                container.setAdContainer(playerView);

                // Build an ads request object and point it to the ad
                // display container created above.
                AdsRequest adsRequest = sdkFactory.createAdsRequest();
                adsRequest.setAdTagUrl(adRulesURL);
                adsRequest.setAdDisplayContainer(container);

                ArrayList<AdsRequest> adsRequests = new ArrayList<AdsRequest>(1);
                adsRequests.add(adsRequest);

                // Respond to the event with the new ad requests.
                event.properties.put(GoogleIMAComponent.ADS_REQUESTS, adsRequests);
                eventEmitter.respond(event);
            }
        });

        // Create the Brightcove IMA Plugin and pass in the event
        // emitter so that the plugin can integrate with the SDK.
        googleIMAComponent = new GoogleIMAComponent(playerView, eventEmitter, true);
    }

}
