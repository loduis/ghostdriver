# coding: utf-8
require 'sinatra'
#require "sinatra/reloader" if development?

set :public_folder, 'public'

get '/' do
   send_file File.join(settings.public_folder, 'index.html')
end