from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views as api_views

urlpatterns = [
    # user urls
    path('user/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', api_views.RegisterView.as_view(), name='register'),
    path('user/profile/<user_id>/', api_views.ProfileView.as_view(), name='profile'),

    #post urls
    path('post/category/list/', api_views.CategoryListApiView.as_view(), name='category-list'),
    path('post/category/posts/<category_slug>/', api_views.PostCategoryListApiView.as_view(), name='post-category-list'),
    path('post/list/', api_views.PostListApiView.as_view(), name='post-list'),
    path('post/detail/<slug>/', api_views.PostDetailApiView.as_view(), name='post-detail'),
    path('post/like-post/', api_views.LikePostApiView.as_view(), name='like-post'),
    path('post/bookmark-post/', api_views.BookmarkPostApiView.as_view(), name='bookmark-post'),
    path('post/comment/', api_views.PostCommentApiView.as_view(), name='post-comment'),

    # author dashboard urls/routes
    path('author/dashboard/stats<user_id>/', api_views.DashboardStatsView.as_view(), name='dashboard-stats'),

    path('author/dashbaord/posts/<user_id>/', api_views.DashboardPostListsView.as_view(), name='dashboard-post-list'),

    path('author/dashboard/comments/<user_id>/', api_views.DashboardCommentListsView.as_view(), name='dashboard-comment-list'),

    path('author/dashboard/notifications/<user_id>/', api_views.DashboardNotificationListsView.as_view(), name='dashboard-notification-list'),

    path('author/dashboard/mark-notification/<notification_id>/', api_views.DashboardMarkNotificationSeenApiView.as_view(), name='dashboard-mark-notification-seen'),

    path('author/dashboard/reply-comment/<comment_id>/', api_views.DashboardReplyCommentApiView.as_view(), name='dashboard-reply-comment'),

    path('author/dashboard/post-create/', api_views.DashboardPostCreateApiView.as_view(), name='dashboard-post-create'),

    path('author/dashboard/update-post/<user_id>/<post_id>/', api_views.DashboardPostUpdateApiView.as_view(), name='dashboard-post-update'),
    
]