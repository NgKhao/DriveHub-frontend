import api from './api';
import type {
  CreatePostData,
  SellerPost,
  BackendCreatePostResponse,
} from '../types';
import {
  mapFrontendCreatePostToBackend,
  mapBackendCreatePostResponseToSellerPost,
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
    // TODO: Implement when API is available
    // const response = await api.get<{
    //   messenger: string;
    //   status: number;
    //   detail: unknown[];
    //   instance: string;
    // }>('/seller/posts');

    // For now, return empty array until backend provides this endpoint
    return [];
  },

  // Update post
  updatePost: async (
    postId: string,
    postData: Partial<CreatePostData>
  ): Promise<SellerPost> => {
    // TODO: Implement when API is available
    const response = await api.put<BackendCreatePostResponse>(
      `/seller/posts/${postId}`,
      postData
    );

    return mapBackendCreatePostResponseToSellerPost(response.data.detail.post);
  },

  // Delete post
  deletePost: async (postId: string): Promise<void> => {
    // TODO: Implement when API is available
    await api.delete(`/seller/posts/${postId}`);
  },

  // Get post by ID
  getPostById: async (postId: string): Promise<SellerPost> => {
    // TODO: Implement when API is available
    const response = await api.get<BackendCreatePostResponse>(
      `/seller/posts/${postId}`
    );

    return mapBackendCreatePostResponseToSellerPost(response.data.detail.post);
  },
};
