import api from './api';
import type {
  CreatePostData,
  SellerPost,
  BackendCreatePostResponse,
  BackendUpdatePostResponse,
  BackendGetPostsResponse,
  BackendGetPostDetailResponse,
  BackendDeletePostResponse,
} from '../types';
import {
  mapFrontendCreatePostToBackend,
  mapFrontendCreatePostToBackendUpdate,
  mapBackendCreatePostResponseToSellerPost,
  mapBackendUpdatePostResponseToSellerPost,
  mapBackendGetPostsResponseToSellerPosts,
  mapBackendGetPostDetailResponseToSellerPost,
} from '../types';

export interface CreatePostResult {
  post: SellerPost;
  vnpayUrl: string;
}

export const sellerService = {
  // Create new post with FormData
  createPost: async (postData: CreatePostData): Promise<CreatePostResult> => {
    // Convert frontend data to backend format
    const backendPostData = mapFrontendCreatePostToBackend(postData);

    // Create FormData
    const formData = new FormData();

    // Add postDTO as JSON string
    formData.append('postDTO', JSON.stringify(backendPostData));

    // Add image files
    postData.images.forEach((file) => {
      formData.append('imageFile', file);
    });

    const response = await api.post<BackendCreatePostResponse>(
      '/seller/posts',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Transform backend response to frontend format
    const sellerPost = mapBackendCreatePostResponseToSellerPost(
      response.data.detail.post
    );

    return {
      post: sellerPost,
      vnpayUrl: response.data.detail.vnpayUrl,
    };
  },

  // Get seller's posts
  getMyPosts: async (): Promise<SellerPost[]> => {
    const response = await api.get<BackendGetPostsResponse>('/seller/posts');

    // Transform backend response to frontend format
    return mapBackendGetPostsResponseToSellerPosts(response.data.detail);
  },

  // Update post with FormData
  // Laravel expects fields directly in FormData, not as JSON
  updatePost: async (
    postId: string,
    postData: CreatePostData
  ): Promise<SellerPost> => {
    try {
      // Convert frontend data to backend format
      const backendPostData = mapFrontendCreatePostToBackendUpdate(postData);

      // Create FormData - Laravel expects fields directly, not as JSON
      const formData = new FormData();

      // Add each field individually to FormData
      if (backendPostData.title)
        formData.append('title', backendPostData.title);
      if (backendPostData.description)
        formData.append('description', backendPostData.description);
      if (backendPostData.price !== undefined)
        formData.append('price', backendPostData.price.toString());
      if (backendPostData.brand) formData.append('brand', backendPostData.brand);
      if (backendPostData.model) formData.append('model', backendPostData.model);
      if (backendPostData.year !== undefined)
        formData.append('year', backendPostData.year.toString());
      if (backendPostData.color) formData.append('color', backendPostData.color);
      if (backendPostData.mileage !== undefined)
        formData.append('mileage', backendPostData.mileage.toString());
      if (backendPostData.location)
        formData.append('location', backendPostData.location);
      if (backendPostData.phoneContact)
        formData.append('phoneContact', backendPostData.phoneContact);
      if (backendPostData.transmission)
        formData.append('transmission', backendPostData.transmission);
      if (backendPostData.fuelType)
        formData.append('fuelType', backendPostData.fuelType);
      if (backendPostData.condition)
        formData.append('condition', backendPostData.condition);

      // Add image files - Laravel expects 'images[]' for array
      postData.images.forEach((file) => {
        formData.append('images[]', file);
      });

      // Use POST with _method=PUT for Laravel to handle FormData properly
      formData.append('_method', 'PUT');

      const response = await api.post<BackendUpdatePostResponse>(
        `/seller/posts/${postId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Transform backend response to frontend format
      return mapBackendUpdatePostResponseToSellerPost(response.data.detail);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId: string): Promise<void> => {
    await api.delete<BackendDeletePostResponse>(`/seller/posts/${postId}`);
    // Backend returns 204 status with null detail, no need to process response
  },

  // Get post by ID
  getPostById: async (postId: string): Promise<SellerPost> => {
    const response = await api.get<BackendGetPostDetailResponse>(
      `/seller/posts/${postId}`
    );

    return mapBackendGetPostDetailResponseToSellerPost(response.data.detail);
  },
};
