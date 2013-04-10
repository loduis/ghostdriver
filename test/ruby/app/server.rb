# coding: utf-8
require 'sinatra'
#require "sinatra/reloader" if development?

set :public_folder, 'public'

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