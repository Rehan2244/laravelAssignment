<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class User extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    function insertRecord(Request $req){
        DB::table('users')->insertGetId(['fname'=>$req->fname,'lname'=>$req->lname,'dob'=>$req->dob,'email'=>$req->email,'phone'=>$req->phone,'address'=>$req->address,'remember_token'=>'abcd']);
        return 'Inserted';
    }

    function updateRecord(Request $req){
        DB::table('users')->where('email',$req->email)->update(['address'=>$req->address]);
        return 'Updated address';
    }
}
