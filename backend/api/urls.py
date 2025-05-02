from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views as api_views

urlpatterns = [
    # user urls
    path('user/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', api_views.RegisterView.as_view(), name='register'),
    path('user/profile/<user_id>/', api_views.ProfileView.as_view(), name='user_profile'),

    #post urls
    path('post/category/list/', api_views.CategoryListApiView.as_view(), name='category_list'),
    
    path('post/category/posts/<category_slug>/', api_views.PostCategoryListApiView.as_view(), name='post_category_list'),
    
    path('post/list/', api_views.PostListApiView.as_view(), name='post_list'),
    
    path('post/detail/<slug>/', api_views.PostDetailApiView.
    as_view(), name='post_detail'),
    
    path('post/like-post/', api_views.LikePostApiView.as_view(), name='like_post'),

    path('post/comment/', api_views.PostCommentApiView.as_view(), name='comment_post'),

    path('post/bookmark-post/', api_views.BookmarkPostApiView.as_view(), name='bookmark_post'),

    # dashboard urls
    path('author/dashboard/stats/<user_id>/', api_views.DashboardStatsView.as_view(), name='dashboard_stats'),

    path('author/dashboard/posts/<user_id>/', api_views.DashboardPostListsView.as_view(), name='dashboard_posts'),

    path('author/dashboard/comments/<user_id>/', api_views.DashboardCommentListsView.as_view(), name='dashboard_comments'),

    path('author/dashboard/notifications/<user_id>/', api_views.DashboardNotificationListsView.as_view(), name='dashboard_notifications'),

    path('author/dashboard/mark-notification/', api_views.DashboardMarkNotificationSeenApiView.as_view(), name='mark_notification_seen'),
    
    path('author/dashboard/reply-comment/', api_views.DashboardReplyCommentApiView.as_view(), name='reply_comment'),

    path('author/dashboard/post-create/', api_views.DashboardPostCreateApiView.as_view(), name='post_create'),

    path('author/dashboard/update-post/<user_id>/<post_id>/', api_views.DashboardPostUpdateApiView.as_view(), name='post_update'),

    path('author/dashboard/post-detail/<user_id>/<post_id>/', 
         api_views.DashboardPostDetailAPIView.as_view(), 
         name='dashboard_post_detail'),
]