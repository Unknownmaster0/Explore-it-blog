from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views as api_views

urlpatterns = [
    # user urls
    path('user/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', api_views.RegisterView.as_view(), name='register'),
    path('user/profile/<user_id>/', api_views.ProfileView.as_view(), name='user_profile'),
    path('user/update-profile/<user_id>/', api_views.ProfileUpdateView.as_view(), name='update_profile'),

    #post urls
    path('post/category/list/', api_views.CategoryListAPIView.as_view(), name='category_list'),
    
    path('post/category/posts/<category_slug>/', api_views.PostCategoryListAPIView.as_view(), name='post_category_list'),
    
    path('posts/public/', api_views.PublicPostList.as_view(), name='public-posts'),
    
    path('post/detail/<slug>/', api_views.PostDetailAPIView.
    as_view(), name='post_detail'),
    
    path('post/like-post/', api_views.LikePostAPIView.as_view(), name='like_post'),

    path('post/comment/', api_views.PostCommentAPIView.as_view(), name='comment_post'),

    path('post/bookmark-post/', api_views.BookmarkPostAPIView.as_view(), name='bookmark_post'),

    # dashboard urls
    path('author/dashboard/stats/<user_id>/', api_views.DashboardStatsView.as_view(), name='dashboard_stats'),

    path('author/dashboard/posts/<user_id>/', api_views.DashboardPostListsView.as_view(), name='dashboard_posts'),

    path('author/dashboard/comments/<user_id>/', api_views.DashboardCommentListsView.as_view(), name='dashboard_comments'),

    path('author/dashboard/notifications/<user_id>/', api_views.DashboardNotificationListsView.as_view(), name='dashboard_notifications'),

    path('author/dashboard/mark-notification/', api_views.DashboardMarkNotiSeenAPIView.as_view(), name='mark_notification_seen'),
    
    path('author/dashboard/post-create/', api_views.DashboardPostCreateAPIView.as_view(), name='post_create'),

    path('author/dashboard/update-post/<user_id>/<post_id>/', api_views.DashboardPostUpdateAPIView.as_view(), name='post_update'),

    path('author/dashboard/post-detail/<user_id>/<post_id>/', 
         api_views.DashboardPostDetailAPIView.as_view(), 
         name='dashboard_post_detail'),
]