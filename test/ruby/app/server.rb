# coding: utf-8
require 'sinatra'
require 'erb'
#require "sinatra/reloader" if development?

set :public_folder, 'public'
set :views, 'views'

get '/' do
   send_file File.join(settings.public_folder, 'index.html')
end

get '/frame' do
   send_file File.join(settings.public_folder, 'frame.html')
end

post '/submit' do
  sleep 1
  send_file File.join(settings.public_folder, 'submit.html')
end

get '/popup' do
  @q = 'This is an method GET'
  erb :popup
end

post '/popup' do
  @q = params[:q]
  erb :popup
end